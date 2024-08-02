import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { NextResponse } from "next/server";
import * as anchor from "@coral-xyz/anchor";
import { Lifafa } from "@/contracts/lifafa";
import IDL from "@/contracts/lifafa.json";
import { web3, BN } from "@coral-xyz/anchor";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const LIFAFA_PROGRAM_ID = (IDL as Lifafa).address;
const lifafaProgramId = new PublicKey(LIFAFA_PROGRAM_ID);
const LIFAFA_SEED = "lifafa";
const solanaRPC =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet"
    ? process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC
    : process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC;

function getLifafaPDA(lifafaId: number): [anchor.web3.PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(LIFAFA_SEED), new BN(lifafaId).toArrayLike(Buffer, "le", 8)],
    lifafaProgramId,
  );
}

interface LifafaData {
  id: BN;
  creationTime: BN;
  timeLimit: BN;
  owner: PublicKey;
  ownerName: string;
  claims: BN;
  maxClaims: BN;
  mintOfTokenBeingSent: PublicKey;
  amount: BN;
  desc: string;
}

async function getLifafaData(id: number): Promise<LifafaData> { 
  const connection = new Connection(solanaRPC || clusterApiUrl("devnet"));
  const wallet = new anchor.Wallet(anchor.web3.Keypair.generate());
  const provider = new anchor.AnchorProvider(connection, wallet);

  const program = new anchor.Program(
    IDL as Lifafa,
    provider,
  ) as unknown as anchor.Program<Lifafa>;

  const [lifafaPDA] = getLifafaPDA(id);
  const data = await program.account.lifafa.fetch(lifafaPDA);
  return data;
}

function isClaimDisabled(lifafaData: LifafaData): boolean {
  const currentTime = Date.now() / 1000; // Convert to seconds
  return (
    lifafaData.claims.toNumber() >= lifafaData.maxClaims.toNumber() ||
    currentTime >
      lifafaData.creationTime.toNumber() + lifafaData.timeLimit.toNumber()
  );
}

export const GET = async (req: Request) => {
  try {
    const id = req.url.split("/").pop();
    if (!id) {
      return new NextResponse("Invalid ID", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
    const lifafaId = parseInt(id);
    // console.log("lifafa id", lifafaId);
    const lifafaData = await getLifafaData(lifafaId);
    // console.log(lifafaData);
    const unit = 1e6; // LAMPORTS_PER_SOL
    const amountString = (lifafaData.amount / unit).toString();
    const tokenName = "SEND";

    const payload: ActionGetResponse = {
      title: `🎉 Claim your share of ${amountString} ${tokenName} now!🚀✨`,
      description: lifafaData.desc,
      icon: new URL("/claim_lifafa_og.png", new URL(req.url).origin).toString(),
      label: `Claim Now`,
      disabled: isClaimDisabled(lifafaData),
    };

    return NextResponse.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new NextResponse(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const id = req.url.split("/").pop();
    if (!id) {
      return new NextResponse("Invalid ID", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
    const lifafaId = parseInt(id);

    const body: ActionPostRequest = await req.json();

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const connection = new Connection(solanaRPC || clusterApiUrl("devnet"));
    const keypairWallet = anchor.web3.Keypair.generate();
    const wallet = new anchor.Wallet(keypairWallet);
    const provider = new anchor.AnchorProvider(connection, wallet);

    const program = new anchor.Program(IDL as Lifafa, provider);

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 15000,
    });
    const txn = new Transaction().add(addPriorityFee);

    const [lifafaPDA] = getLifafaPDA(lifafaId);
    const data = await program.account.lifafa.fetch(lifafaPDA);
    const mint = data.mintOfTokenBeingSent;
    const vault = getAssociatedTokenAddressSync(mint, lifafaPDA, true);
    const ata = getAssociatedTokenAddressSync(mint, account);
    const accountInfo = await connection.getAccountInfo(ata);
    if (accountInfo === null) {
      // console.log("No ata account info creating one");
      txn.add(
        createAssociatedTokenAccountInstruction(
          account,
          ata,
          account,
          mint,
        ),
      );
    }
    const instruction = await program.methods
      .claimSplLifafa(new anchor.BN(id))
      .accounts({
        mint: mint,
        vault: vault,
        signer: account,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();
    txn.add(instruction);

    txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    txn.feePayer = account;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction: txn,
        message: "Congrats! your rewards have been added to your wallet",
      },
      // no additional signers are required for this transaction
      // signers: [fee_wallet],
    });

    return new Response(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
    });

    // return NextResponse.json(payload, {
    //   headers: ACTIONS_CORS_HEADERS,
    // });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new NextResponse(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};
