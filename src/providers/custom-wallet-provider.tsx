"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { SIGN_MESSAGE } from "@/data/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction, VersionedTransaction } from "@solana/web3.js";

export interface CustomWalletContext {
  walletAddress: string | null;
  getSignature(): Promise<{ data: number[] } | undefined>;
  signTransaction:
    | (<T extends VersionedTransaction | Transaction>(
        transaction: T
      ) => Promise<T>)
    | undefined;
  connected: boolean;
}

const CustomWalletContext = createContext<CustomWalletContext | undefined>(
  undefined
);

export function CustomWalletProvider({ children }: { children: ReactNode }) {
  const { publicKey, signMessage, signTransaction, connected } = useWallet();
  const walletAddress = useMemo(
    () => (publicKey ? publicKey.toString() : null),
    [publicKey]
  );

  async function getSignature(): Promise<{ data: number[] } | undefined> {
    if (!signMessage) {
      return undefined;
    }
    const message = new TextEncoder().encode(SIGN_MESSAGE);
    const signature = await signMessage(message);
    return { data: Array.from(signature) }; // Convert Uint8Array to number array
  }

  return (
    <CustomWalletContext.Provider
      value={{ walletAddress, getSignature, signTransaction, connected }}
    >
      {children}
    </CustomWalletContext.Provider>
  );
}

export const useCustomWallet = () => {
  return useContext(CustomWalletContext) as CustomWalletContext;
};
