"use client";

import { createContext, ReactNode, useContext } from "react";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useConnectorWallet } from "@/hooks/useConnectorWallet";
import { useOktoWallet } from "@/hooks/useOktoWallet";

export interface CustomWalletContext {
  walletAddress: string | null;
  walletPublicKey: PublicKey | null;
  isLoggedIn: boolean;
  userName: string;
  executeRawTransaction(rawTxn: anchor.web3.Transaction): Promise<string>;
  getTokenBalance(tokenMintAddress: string): Promise<number>;
}

export type WalletType = "connector" | "okto";

const CustomWalletContext = createContext<CustomWalletContext | undefined>(
  undefined,
);

export function CustomWalletProvider({
  children,
  walletType,
}: {
  children: ReactNode;
  walletType: WalletType;
}) {

  const connectorWallet = useConnectorWallet();
  const oktoWallet = useOktoWallet();

  const walletContextValue =
    walletType === "connector" ? connectorWallet : oktoWallet;

  return (
    <CustomWalletContext.Provider value={walletContextValue}>
      {children}
    </CustomWalletContext.Provider>
  );
}

export const useCustomWallet = () => {
  return useContext(CustomWalletContext) as CustomWalletContext;
};
