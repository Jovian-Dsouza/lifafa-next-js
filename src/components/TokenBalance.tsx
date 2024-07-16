import React, { useEffect, useMemo, useState } from "react";
// import { useOkto } from "okto-sdk-react-native";
// import { useCluster } from "../providers/ClusterProvider";
// import { useWallet } from "../providers/WalletProvider";

interface TokenBalanceProps {
  token: {
    symbol: string;
  };
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ token }) => {
  // const { getPortfolio } = useOkto();
  // const { selectedCluster } = useCluster();
  // const { wallet, getBalance: getOktoBalance } = useWallet();
  const [balance, setBalance] = useState(0);

  // const networkName = useMemo(
  //   () => selectedCluster.name.toUpperCase(),
  //   [selectedCluster],
  // );

  // async function getBalance() {
  //   const balanceTmp = await getOktoBalance(token.symbol);
  //   setBalance(balanceTmp);
  // }

  // useEffect(() => {
  //   if (wallet) {
  //     getBalance();
  //   }
  // }, [token, networkName, wallet]);

  return (
    <p className="text-gray-500 text-xs">
      Bal: {balance} {token.symbol}
    </p>
  );
};

export default TokenBalance;
