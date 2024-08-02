import { useCluster } from "@/providers/cluster-provider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { CustomWalletContext } from "@/providers/custom-wallet-provider";
import { useOkto, OktoContextType, Wallet, Token } from "okto-sdk-react";
import { solanaTransaction } from "@/utils/solana-okto";

const shortenWalletAddress = (address: string | null): string => {
  if (!address || address.length <= 8) {
    return "";
  }
  const start = address.slice(0, 4);
  const end = address.slice(-4);
  return `${start}...${end}`;
};



export function useOktoWallet(): CustomWalletContext {
  const {
    getWallets,
    getPortfolio,
    isLoggedIn,
    executeRawTransactionWithJobStatus,
  } = useOkto() as OktoContextType;
  const { cluster } = useCluster();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const walletPublicKey = useMemo(() => {
    if (!walletAddress) {
      return null;
    }
    return new PublicKey(walletAddress);
  }, [walletAddress]);

  const { getExplorerUrl } = useCluster();
  const userName = useMemo(
    () => shortenWalletAddress(walletAddress),
    [walletAddress],
  );

  async function fetchWalletAddress() {
    try {
      const walletData = await getWallets();
      console.log("wallet Data", walletData)
      const solanaWallet = walletData.wallets.find(
        (x: Wallet) => x.network_name === cluster.networkName,
      );
      if (solanaWallet) {
        setWalletAddress(solanaWallet.address);
      } else {
        console.log(
          `Error: Could not find ${
            cluster.networkName
          } in wallets: ${walletData.wallets.map((x) => x.network_name)}`,
        );
      }
    } catch (error) {
      console.log("fetchWalletAddress: ", error);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchWalletAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  async function executeRawTransaction(
    rawTxn: anchor.web3.Transaction,
  ): Promise<string> {
    if (!walletAddress) {
      throw new Error("Wallet not connected");
    }
    const solTxn = solanaTransaction(
      rawTxn,
      [walletAddress],
      cluster.networkName,
    );
    // const solTxn = getTestTransaction(cluster.networkName, walletAddress)
    console.log(solTxn)
    const job = await executeRawTransactionWithJobStatus(solTxn);
    if(job.status == "FAILED"){
        throw new Error(`execute transaction failed orderId: ${job.order_id} on network: ${job.network_name}`)
    }
    console.log("job", job)
    const txid = job.transaction_hash;
    console.log(`View transaction:${getExplorerUrl("tx/" + txid)}`);
    return txid;
  }

  async function getTokenBalance(tokenAddress: string): Promise<number> {
    if (!isLoggedIn) {
      throw new Error("Wallet not connected");
    }

    try {
        const portfolio = await getPortfolio();
        console.log("portfolio", portfolio)
        
        const token = portfolio.tokens.find(
          (x: Token) => x.network_name === cluster.networkName && x.token_address == tokenAddress,
        );
        if(token){
            return Number(token.quantity);
        }
        else{
            console.error(`Could not find ${tokenAddress} in tokens`)
        }
    } catch (error) {
        console.error("error fetching balance: ", error)
    }

    return 0;
  }

  return {
    walletAddress,
    walletPublicKey,
    isLoggedIn,
    userName,
    executeRawTransaction,
    getTokenBalance,
  };
}
