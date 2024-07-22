import { useMemo } from "react";
import { XMarkIcon, UsersIcon, ClockIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface EnvelopeModalProps {
  amount: number;
  tokenSymbol: string;
  tokenIcon: string;
  timeLeft: number;
  maxClaims: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onCopyLink: () => void;
  onShare: () => void;
}

export function EnvelopeModal({
  amount,
  tokenSymbol,
  tokenIcon,
  timeLeft,
  maxClaims,
  visible,
  setVisible,
  onCopyLink,
  onShare,
}: EnvelopeModalProps) {
  const numDaysLeft = useMemo(() => {
    if (timeLeft > 0) {
      return Math.ceil(timeLeft / (60 * 60 * 24)); // Convert seconds to days
    }
    return 0;
  }, [timeLeft]);

  function close() {
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={close}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="p-6">
          <div className="flex flex-col items-center">
            <p className="text-gray-800 font-bold">Lifafa Created!</p>
            <div className="flex items-center mt-4 space-x-2">
              <img
                src={tokenIcon}
                alt="Token Icon"
                className="rounded-full w-8 h-8"
              />
              <p className="text-gray-800 font-bold text-2xl">
                {amount} {tokenSymbol}
              </p>
            </div>
            <div className="flex items-center mt-4 space-x-2">
              <ClockIcon className="h-5 w-5 text-purple-600" />
              <p className="text-gray-800 text-sm">{numDaysLeft} days</p>
              <div className="w-px h-4 bg-gray-800" />
              <UsersIcon className="h-5 w-5 text-purple-600" />
              <p className="text-gray-800 text-sm">
                {maxClaims ? maxClaims : 0}
              </p>
            </div>
          </div>
          <div className="flex justify-around mt-6 space-x-4">
            <button
              className="bg-gray-800 text-white py-2 px-4 rounded-full"
              onClick={() => {
                onCopyLink();
                close();
              }}
            >
              Copy link
            </button>
            <button
              className="bg-gray-800 text-white py-2 px-4 rounded-full"
              onClick={() => {
                onShare();
                close();
              }}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
