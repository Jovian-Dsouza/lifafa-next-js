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
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { NextResponse } from "next/server";
import * as anchor from "@coral-xyz/anchor";
import { Lifafa } from "@/contracts/lifafa";
import IDL from "@/contracts/lifafa.json";
import { web3, BN } from "@coral-xyz/anchor";
// import { getLifafaPDA } from "@/hooks/useLifafaProgram";
// import { getAssetByAddress } from "@/data/solanaAssests";
import base58 from "bs58";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const LIFAFA_PROGRAM_ID = (IDL as Lifafa).address;
const lifafaProgramId = new PublicKey(LIFAFA_PROGRAM_ID);
const LIFAFA_SEED = "lifafa";

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
  const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
  );
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
      // links: {
      //   actions: [
      //     {
      //       label: "Claim ",
      //       href: `/api/actions/claim_lifafa`,
      //     },
      //   ],
      // },
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

    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
    );
    const keypairWallet = anchor.web3.Keypair.generate();
    const wallet = new anchor.Wallet(keypairWallet);
    const provider = new anchor.AnchorProvider(connection, wallet);

    const program = new anchor.Program(IDL as Lifafa, provider);

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 15000,
    });
    const instructions = [addPriorityFee];

    const [lifafaPDA] = getLifafaPDA(lifafaId);
    const data = await program.account.lifafa.fetch(lifafaPDA);

    const vault = await getAssociatedTokenAddress(
      data.mintOfTokenBeingSent,
      wallet.publicKey,
    );
    if (vault === null) {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          vault,
          lifafaPDA,
          data.mintOfTokenBeingSent,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        ),
      );
    }

    instructions.push(
      await program.methods
        .claimSplLifafa(new anchor.BN(lifafaId))
        .accounts({
          mint: data.mintOfTokenBeingSent,
          vault: vault,
          signer: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction(),
    );

    const txn = new Transaction().add(...instructions);
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
