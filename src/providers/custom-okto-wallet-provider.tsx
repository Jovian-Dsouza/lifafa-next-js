import React, {
  useMemo,
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { OktoContextType, useOkto } from "okto-sdk-react";
import { PublicKey } from "@solana/web3.js";

interface Wallet {
  address: string;
  network_name: string;
  [key: string]: any;
}

interface Cluster {
  name: string;
}

interface WalletContextProps {
  wallet: Wallet | null;
  walletPublicKey: PublicKey | null;
  network: string;
  getWalletForSelectedCluster: () => Promise<any>;
  getBalance: (token_symbol: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function CustomOktoWalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const { selectedCluster } = useCluster();
  const { getWallets, getPortfolio, isLoggedIn } = useOkto() as OktoContextType;

  const network = useMemo(
    () => {
      if (selectedCluster.name.toUpperCase() === "MAINNET") {
        return "SOLANA";
      }
      return `SOLANA_${selectedCluster.name.toUpperCase()}`;
    },
    [selectedCluster]
  );

  const network_name = useMemo(
    () => selectedCluster.name.toUpperCase(),
    [selectedCluster],
  );

  async function getWalletForSelectedCluster() {
    try {
      const walletData = await getWallets();
      console.log("network", network)
      const solanaWallet = walletData.wallets.find(
        (x: Wallet) => x.network_name === network,
      );
      if (!solanaWallet) {
        console.log(
          `Error: Could not find ${network} in wallets: ${walletData.wallets}`,
        );
        return null;
      }
      return solanaWallet
    } catch (error) {
      console.log("getWalletForSelectedCluster: ", error);
    }
    return null
  }

  async function getBalance(token_symbol: string): Promise<string> {
    const portfolio = await getPortfolio();
    const tokenDetail = portfolio.tokens.find(
      (x: { token_name: string }) =>
        x.token_name === `${token_symbol}_${network_name}`,
    );
    if (tokenDetail) {
      return tokenDetail.quantity;
    }
    return "0";
  }

  //   useEffect(() => {
  //     if (isLoggedIn && selectedCluster) {
  //       getWalletForSelectedCluster();
  //     }
  //   }, [isLoggedIn, selectedCluster]);

  // useEffect(() => {
  //   console.log("rendered");
  // });

  useEffect(() => {
    if (isLoggedIn) {
      console.log("Okto is logged in");

      (async () => {
        const wallets = await getWallets();
        console.log("wallets", wallets);

        const portfolio = await getPortfolio();
        console.log("portfolio", portfolio);
      })();
    }
  }, [isLoggedIn]);

  const walletPublicKey = useMemo(() => {
    if (!wallet) {
      return null;
    }
    return new PublicKey(wallet.address);
  }, [wallet]);

  useEffect(() => {
    console.log("Wallet: ", walletPublicKey?.toString());
  }, [walletPublicKey]); // log walletPublicKey only when it changes

  return (
    <WalletContext.Provider
      value={{
        wallet,
        walletPublicKey,
        network,
        getWalletForSelectedCluster,
        getBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useOktoWallet(): WalletContextProps {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useOktoWallet must be used within a WalletProvider");
  }
  return context;
}

// Placeholder useCluster hook for TypeScript purposes
interface UseClusterReturn {
  selectedCluster: Cluster;
}

function useCluster(): UseClusterReturn {
  // Replace with actual implementation
  return {
    selectedCluster: {
      name: "mainnet",
    },
  };
}
