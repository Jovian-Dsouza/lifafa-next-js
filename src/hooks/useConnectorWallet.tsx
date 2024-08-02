import { useCluster } from "@/providers/cluster-provider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { CustomWalletContext } from "@/providers/custom-wallet-provider";

const shortenWalletAddress = (address: string | null): string => {
  if (!address || address.length <= 8) {
    return "";
  }
  const start = address.slice(0, 4);
  const end = address.slice(-4);
  return `${start}...${end}`;
};

export function useConnectorWallet() : CustomWalletContext{
    const { publicKey, signTransaction, connected } = useWallet();
    const { connection } = useConnection();
    const walletAddress = useMemo(
      () => (publicKey ? publicKey.toString() : null),
      [publicKey],
    );
    const { getExplorerUrl } = useCluster();
    const userName = useMemo(
      () => shortenWalletAddress(walletAddress),
      [walletAddress],
    );

    async function executeRawTransaction(
      rawTxn: anchor.web3.Transaction,
    ): Promise<string> {
      const signedTransaction = await signTransaction!(rawTxn);
      const txid = await connection.sendRawTransaction(
        signedTransaction.serialize(),
      );
      await connection.confirmTransaction(txid);
      console.log(`View transaction:${getExplorerUrl("tx/" + txid)}`);
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

    return {
      walletAddress,
      walletPublicKey: publicKey,
      isLoggedIn: connected,
      userName,
      executeRawTransaction,
      getTokenBalance,
    };
}