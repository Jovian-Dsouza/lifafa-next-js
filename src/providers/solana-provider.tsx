"use client";

import dynamic from "next/dynamic";
import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ReactNode, useCallback, useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter";

require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const TipLinkProvider = dynamic(
  async () => await import("./tiplink-provider"),
  {
    ssr: false,
  }
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_MAINNET_RPC
    ? process.env.NEXT_PUBLIC_MAINNET_RPC
    : clusterApiUrl("devnet");
  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  const wallets = useMemo(
    () => [
      // new TipLinkWalletAdapter({
      //   title: "Escrow Interface",
      //   clientId: process.env.NEXT_PUBLIC_TIPLINK_WALLET_CLIENT_ID!,
      //   theme: "light",
      // }),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        {/* <TipLinkProvider> */}
          <WalletModalProvider>{children}</WalletModalProvider>
        {/* </TipLinkProvider> */}
      </WalletProvider>
    </ConnectionProvider>
  );
}
