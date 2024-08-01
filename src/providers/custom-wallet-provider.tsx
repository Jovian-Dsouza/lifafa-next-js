"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export interface CustomWalletContext {
  walletAddress: string | null;
  walletPublicKey: PublicKey | null;
  isLoggedIn: boolean;
  executeRawTransaction(rawTxn: anchor.web3.Transaction): Promise<string>;
  getTokenBalance(tokenMintAddress: string): Promise<number>;
}

const CustomWalletContext = createContext<CustomWalletContext | undefined>(
  undefined,
);

export function CustomWalletProvider({ children }: { children: ReactNode }) {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const walletAddress = useMemo(
    () => (publicKey ? publicKey.toString() : null),
    [publicKey],
  );

  async function executeRawTransaction(
    rawTxn: anchor.web3.Transaction,
  ): Promise<string> {
    const signedTransaction = await signTransaction!(rawTxn);
    const txid = await connection.sendRawTransaction(
      signedTransaction.serialize(),
    );
    await connection.confirmTransaction(txid);
    console.log(`View transaction on Solscan: https://solscan.io/tx/${txid}`);
    return txid;
  }

  async function getTokenBalance(tokenMintAddress: string): Promise<number> {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    const tokenMintPublicKey = new PublicKey(tokenMintAddress);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { mint: tokenMintPublicKey },
    );

    if (tokenAccounts.value.length === 0) {
      return 0;
    }

    const tokenBalance =
      tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    return tokenBalance;
  }

  return (
    <CustomWalletContext.Provider
      value={{
        walletAddress,
        walletPublicKey: publicKey,
        isLoggedIn: connected,
        executeRawTransaction,
        getTokenBalance,
      }}
    >
      {children}
    </CustomWalletContext.Provider>
  );
}

export const useCustomWallet = () => {
  return useContext(CustomWalletContext) as CustomWalletContext;
};
