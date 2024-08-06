"use client";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Container } from "@/components/Container";
import Image from "next/image";
import RedeemLifafa from "../../../../public/claim_lifafa_og.png";
import { useLifafaProgram } from "@/hooks/useLifafaProgram";
import { getTokenByAddress } from "@/data/constants";
import { LifafaData } from "@/Types";
import { useCustomWallet } from "@/providers/custom-wallet-provider";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const LifafaStatus = ({
  numDaysLeft,
  claims,
  disabled,
  onOpen,
}: {
  numDaysLeft: number;
  claims: number;
  disabled: boolean;
  onOpen: any;
}) => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-5">
        <span className="text-gray-500 text-sm">{numDaysLeft} days</span>
        <div className="bg-gray-500 p-0.5 rounded-full" />
        <span className="text-gray-500 text-sm">
          {claims ? claims : 0} claims left
        </span>
      </div>
      <button
        disabled={disabled}
        className={`p-4 w-full rounded-full mt-4 ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black cursor-pointer"
        }`}
        onClick={onOpen}
      >
        <span className="text-white text-center">Claim Lifafa</span>
      </button>
    </div>
  );
};

const LifafaActions = () => {
  return (
    <div className="bg-red-300 w-full">
      <span className="text-gray-500 text-sm mt-2">
        Create your own Lifafa and share with friends.
      </span>
      <div className="flex mt-4 space-x-4 w-full">
        <button
          className="border border-gray-300 flex-1 py-3 rounded-full"
          onClick={() => {}}
        >
          <span className="text-black text-center font-bold">
            Create Lifafa
          </span>
        </button>

        <button
          className="bg-black w-full py-3 rounded-full"
          onClick={() => {}}
        >
          <span className="text-white text-center font-bold">Share</span>
        </button>
      </div>
    </div>
  );
};

const NoLifafaMessage = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center mt-[6rem] md:mt-[10rem] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <ExclamationCircleIcon className="h-20 w-20 text-blue-600 dark:text-blue-300 mb-4" />
        <span className="font-bold text-lg md:text-2xl text-gray-800 dark:text-gray-200">No lifafa found</span>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 text-center max-w-sm">
          It seems that the lifafa you are looking for is not available.
        </p>
        {/* <button className="mt-6 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-400 transition duration-300">
          Go Back
        </button> */}
      </div>
    </div>
  );
};

const Redeem = ({ params }: { params: { id: string } }) => {
  const lifafaId = params.id;
  const { claimLifafa, fetchLifafa, program } = useLifafaProgram();
  const [isOpen, setIsOpen] = useState(false);
  const [lifafaData, setLifafaData] = useState<LifafaData | null>(null);
  const disabled = useMemo(() => !program, [program]);
  const { walletPublicKey, executeRawTransaction } = useCustomWallet();

  async function getLifafaData() {
    if (!lifafaId) {
      return;
    }
    try {
      const id = Number(lifafaId);
      const pdaData = await fetchLifafa(id);
      if (!pdaData) {
        return;
      }
      const mintToken = getTokenByAddress(
        pdaData.mintOfTokenBeingSent.toString(),
      );
      if (!mintToken) {
        return;
      }
      const remainingClaims = pdaData.maxClaims - pdaData.claims;
      const expiryTime = dayjs.unix(
        Number(pdaData.creationTime) + Number(pdaData.timeLimit),
      );
      const daysLeft = expiryTime.diff(dayjs(), "day");
      const lifafaDataTmp = {
        id: id,
        amount: Number(pdaData.amount / (10 * mintToken.decimals)),
        claims: remainingClaims,
        numDaysLeft: daysLeft,
        ownerName: pdaData.ownerName,
        desc: pdaData.desc,
        tokenSymbol: mintToken.symbol,
        tokenIcon: mintToken.icon,
      };
      setLifafaData(lifafaDataTmp);
    } catch (error) {
      console.log("getLifafaData: ", error);
    }
  }

  async function handleClaim() {
    if (!walletPublicKey) {
      throw new Error("Wallet not initialized");
    }
    try {
      const rawTxn = await claimLifafa(Number(lifafaId), walletPublicKey);
      const txnHash = await executeRawTransaction(rawTxn);
      console.log("Lifafa claimed")
    } catch (error) {
      console.error("create Lifafa: ", error);
    }
  }

  useEffect(() => {
    if (!program) {
      return;
    }
    getLifafaData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  if (!lifafaData) {
    return (
      <NoLifafaMessage />
    );
  }

  return (
    <Container>
      <div className="flex flex-col items-center justify-center gap-12">
        <Image
          src={RedeemLifafa}
          alt="redeem envelop-image"
          className="w-auto h-[20rem]"
        />

        <div className="flex flex-col justify-center space-y-3 w-full">
          <span className="text-sm text-gray-500">
            From {lifafaData.ownerName}
          </span>
          <span className="text-2xl text-black font-bold">
            {lifafaData.desc}
          </span>

          {isOpen ? (
            <LifafaActions />
          ) : (
            <LifafaStatus
              numDaysLeft={lifafaData.numDaysLeft}
              claims={lifafaData.claims}
              disabled={disabled}
              onOpen={handleClaim}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default Redeem;
