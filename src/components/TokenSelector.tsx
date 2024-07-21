import { useState } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";
import { tokens } from "../data/constants";
// import { TokenSelectorModal } from "./TokenSelectorModal";

export const TokenSelector = ({
  token,
  onSelect,
}: {
  token: any;
  onSelect: any;
}) => {
  const [modalVisible, setModalVisible] = useState(true);
  function handleSelect() {
    onSelect(tokens[0]); //TODO: add token based on drop box
  }

  return (
    <div className="flex items-center">
      <div className="relative mr-4">
        <Image
          src={token.icon}
          alt="Token Icon"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="absolute -bottom-1 -right-1 border-2 border-white rounded-full">
          <Image
            src={token.blockchainIcon}
            alt="Blockchain Icon"
            width={16}
            height={16}
            className="rounded-full"
          />
        </div>
      </div>
      <div>
        <button
          onClick={handleSelect}
          className="flex items-center justify-center space-x-1"
        >
          <span className="font-semibold">{token.symbol}</span>
          <ChevronDownIcon className="h-4 w-4 text-gray-800" />
        </button>
        <span className="text-xs text-gray-500">on {token.blockchain}</span>
      </div>
      {/* <TokenSelectorModal visible={modalVisible} setVisible={setModalVisible} /> */}
    </div>
  );
};
