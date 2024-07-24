import { Token } from "@/data/constants";
import { getTokenPrice } from "@/utils/jupiter-price";
import React, { useMemo, useState, useEffect } from "react";

interface AmountInputProps {
  amount: number;
  setAmount: (amount: number) => void;
  token: Token;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  setAmount,
  token,
}) => {

  const [tokenPrice, setTokenPrice] = useState<number>(0);
  
  const price = useMemo(() => {
    // TODO: Update with price API
    if (!amount) {
      return 0;
    }
    return amount * tokenPrice;
  }, [amount, tokenPrice]);

  async function updateTokenPrice() {
    const token_price = await getTokenPrice(token.address);
    // console.log(token_price)
    setTokenPrice(token_price)
  }

  useEffect(()=>{
    updateTokenPrice()
  }, [amount])

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const floatAmount = parseFloat(e.target.value);
    setAmount(floatAmount);
  }

  return (
    <div className="flex flex-col items-end">
      <input
        type="number"
        value={amount}
        onChange={handleAmountChange}
        className="text-xl text-end font-semibold outline-none bg-white w-20 no-scrollbar"
        min="0"
      />
      <p className="text-xs text-gray-500">{price.toFixed(2)} USDC</p>
    </div>
  );
};
