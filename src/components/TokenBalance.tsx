import { Token } from "@/data/constants";
import { useCustomWallet } from "@/providers/custom-wallet-provider";
import React, { useEffect, useMemo, useState } from "react";

interface TokenBalanceProps {
  token: Token
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ token }) => {
  const { getTokenBalance, isLoggedIn } = useCustomWallet();
  const [balance, setBalance] = useState(0);

  async function getBalance() {
    const balanceTmp = await getTokenBalance(token.address);
    setBalance(balanceTmp);
  }

  useEffect(() => {
    if (isLoggedIn) {
      getBalance();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isLoggedIn]);

  return (
    <p className="text-gray-500 text-xs">
      Bal: {balance} {token.symbol}
    </p>
  );
};

export default TokenBalance;
