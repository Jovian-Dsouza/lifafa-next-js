import { Program } from "@coral-xyz/anchor";
import { useMemo } from "react";
import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";

import { Lifafa } from "@/contracts/lifafa";
import IDL from "@/contracts/lifafa.json"

import {
  Transaction,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";

export const LIFAFA_PROGRAM_ID = (IDL as Lifafa).address;
export const LIFAFA_SEED = "lifafa";

export function useLifafaProgram() {
  const { publicKey: walletPublicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const provider = useMemo(() => {
    if (wallet) {
      return new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
      });
    }
  }, [connection, wallet]);
  const lifafaProgramId = new PublicKey(LIFAFA_PROGRAM_ID);

  const program = useMemo(() => {
    if (!provider) {
      return null;
    }
    return new Program<Lifafa>(IDL as Lifafa, provider);
  }, [provider]);

  async function processAndSend(
    instruction: anchor.web3.TransactionInstruction,
  ) {
    const txn = new Transaction().add(instruction);
    txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    txn.feePayer = walletPublicKey!;

    const signedTransaction = await signTransaction!(txn);
    const txid = await connection.sendRawTransaction(
      signedTransaction.serialize(),
    );
    await connection.confirmTransaction(txid);

    // Provide Solscan link
    console.log(
      `View transaction on Solscan: https://solscan.io/tx/${txid}?cluster=devnet`,
    );
  }

  function getLifafaPDA(lifafaId: any) {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(LIFAFA_SEED), new BN(lifafaId).toArrayLike(Buffer, "le", 8)],
      lifafaProgramId,
    );
  }

  async function createLifafa(
    id: number,
    amount: number,
    timeLimit: number,
    maxClaims: number,
    ownerName: string,
    desc: string,
  ) {
    console.log(`\nCreate Envelope, amount = ${amount}, id = ${id}`);
    if (!program) {
      throw new Error("Program not initialized");
    }
    if (!walletPublicKey || !wallet) {
      throw new Error("Wallet not initialized");
    }
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    try {
      const instruction = await program.methods
        .createSolLifafa(
          new anchor.BN(id),
          new anchor.BN(amount * LAMPORTS_PER_SOL),
          new anchor.BN(timeLimit),
          new anchor.BN(maxClaims),
          ownerName,
          desc,
        )
        .accounts({
          signer: walletPublicKey,
        })
        .instruction();
      await processAndSend(instruction);
    } catch (error) {
      console.error("Transaction failed", error);
      throw error;
    }
  }

  async function claimLifafa(id: any) {
    console.log("\nClaiming Envelope id: ", id);
    if (!program) {
      throw new Error("Program not initialized");
    }
    if (!walletPublicKey || !wallet) {
      throw new Error("Wallet not initialized");
    }
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    try {
      const [lifafaPDA] = getLifafaPDA(id);
      const instruction = await program.methods
        .claimSolLifafa(new anchor.BN(id))
        .accounts({
          signer: walletPublicKey,
        })
        .instruction();
      await processAndSend(instruction);
    } catch (error) {
      console.error("Transaction failed", error);
      throw error;
    }
  }

  async function fetchLifafa(id: number) {
   if (!program) {
     throw new Error("Program not initialized");
   }
   if (!walletPublicKey || !wallet) {
     throw new Error("Wallet not initialized");
   }
   if (!provider) {
     throw new Error("Provider not initialized");
   }
    try {
      const [lifafaPDA] = getLifafaPDA(id);
      const lifafaAccount = await program.account.lifafa.fetch(lifafaPDA);
      return lifafaAccount;
    } catch (error) {
      console.error("Error fetchLifafa:", error);
      return null;
    }
  }

  const value = useMemo(
    () => ({
      createLifafa,
      claimLifafa,
      getLifafaPDA,
      fetchLifafa,
      program,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [program],
  );

  return value;
}
