import { tokens } from "../data/constants";
import Image from "next/image";

export const TokenSelectorModal = ({
  visible,
  setVisible,
  onSelect,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSelect: (token: any) => void;
}) => {
  if (!visible) return null;

  function handleTokenClick(token: any) {
    onSelect(token);
    setVisible(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Select a Token</h2>
        <div className="grid grid-cols-1 gap-4">
          {tokens.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => handleTokenClick(token)}
            >
              <Image
                src={token.icon}
                alt="Token Icon"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="ml-2 font-semibold">{token.symbol}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setVisible(false)}
          className="mt-4 w-full bg-gray-200 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};