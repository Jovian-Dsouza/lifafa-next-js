import { Program } from "@coral-xyz/anchor";
import { useMemo, useEffect } from "react";
import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { Lifafa } from "@/contracts/lifafa";
import IDL from "@/contracts/lifafa.json";

import { Transaction, PublicKey, ComputeBudgetProgram } from "@solana/web3.js";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export const LIFAFA_PROGRAM_ID = (IDL as Lifafa).address;
const lifafaProgramId = new PublicKey(LIFAFA_PROGRAM_ID);
export const LIFAFA_SEED = "lifafa";

export function getLifafaPDA(
  lifafaId: number,
): [anchor.web3.PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(LIFAFA_SEED), new BN(lifafaId).toArrayLike(Buffer, "le", 8)],
    lifafaProgramId,
  );
}

export enum ClaimMode {
  Random = 0,
  Equal = 1,
}

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

  const program = useMemo(() => {
    if (!provider) {
      return null;
    }
    return new Program<Lifafa>(IDL as Lifafa, provider);
  }, [provider]);

  async function processAndSend(txn: anchor.web3.Transaction) {
    txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    txn.feePayer = walletPublicKey!;
    const signedTransaction = await signTransaction!(txn);
    const txid = await connection.sendRawTransaction(
      signedTransaction.serialize(),
    );
    await connection.confirmTransaction(txid);
    console.log(`View transaction on Solscan: https://solscan.io/tx/${txid}`);
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
    claimMode: ClaimMode,
    mint: PublicKey,
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
      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 15000,
      });
      const txn = new Transaction().add(addPriorityFee);

      const [lifafaPDA] = getLifafaPDA(id);
      console.log("lifafa", lifafaPDA.toString());

      const vault = getAssociatedTokenAddressSync(mint, lifafaPDA, true);
      const vaultAccountInfo = await connection.getAccountInfo(vault);
      if (vaultAccountInfo === null) {
        console.log("No vault account info creating one");
        txn.add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            vault,
            lifafaPDA,
            mint,
          ),
        );
      }
      const createLifafaInstruction = await program.methods
        .createSplLifafa(
          new anchor.BN(id),
          new anchor.BN(amount),
          new anchor.BN(timeLimit),
          new anchor.BN(maxClaims),
          ownerName,
          desc,
          claimMode,
        )
        .accounts({
          mint: mint,
          vault: vault,
          signer: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();
      txn.add(createLifafaInstruction);

      await processAndSend(txn);
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
      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 15000,
      });
      const txn = new Transaction().add(addPriorityFee);

      const [lifafaPDA] = getLifafaPDA(id);
      const data = await program.account.lifafa.fetch(lifafaPDA);
      const mint = data.mintOfTokenBeingSent;
      const vault = getAssociatedTokenAddressSync(mint, lifafaPDA, true);
      const ata = getAssociatedTokenAddressSync(
        mint,
        provider.wallet.publicKey,
      );
      const accountInfo = await connection.getAccountInfo(ata);
      if (accountInfo === null) {
        console.log("No ata account info creating one");
        txn.add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            ata,
            wallet.publicKey,
            mint,
          ),
        );
      } else {
        console.log("Vault account is there");
      }
      console.log(`id: ${id}`);
      console.log(`mint: ${mint.toString()}`);
      console.log(`vault: ${vault.toString()}`);
      console.log(`wallet: ${provider.wallet.publicKey.toString()}`);
      const instruction = await program.methods
        .claimSplLifafa(new anchor.BN(id))
        .accounts({
          mint: mint,
          vault: vault,
          signer: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();
      txn.add(instruction);
      await processAndSend(txn);
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
