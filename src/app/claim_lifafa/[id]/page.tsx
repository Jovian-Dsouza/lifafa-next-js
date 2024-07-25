"use client";
import { useEffect, useMemo, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import dayjs from "dayjs";
import { Container } from "@/components/Container";
import Image from "next/image";
import RedeemLifafa from "../../../../public/claim_lifafa_og.png";

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
          disabled ? "bg-gray-400" : "bg-black"
        }`}
        onClick={onOpen}
      >
        <span className="text-white text-center">Open Lifafa</span>
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

const Redeem = () => {
  // const { lifafaProgram, claimLifafa, fetchLifafa } = useLifafaProgram();
  const [id, setId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  // const [lifafaData, setLifafaData] = useState();
  const amount = 2;
  const disabled = false;

  const lifafaData = {
    id: id,
    amount: 0,
    claims: 1,
    numDaysLeft: 1,
    ownerName: "jovian",
    desc: "test",
    tokenSymbol: "SOL",
    tokenIcon: "icons",
  };

  async function getLifafaData() {
    // if (!id) {
    //   setLifafaData(null);
    // }
    // try {
    //   const pdaData = await fetchLifafa(id);
    //   const remainingClaims = pdaData.maxClaims - pdaData.claimed.length;
    //   const expiryTime = dayjs.unix(
    //     Number(pdaData.creationTime) + Number(pdaData.timeLimit),
    //   );
    //   const daysLeft = expiryTime.diff(dayjs(), "day");
    //   const lifafaDataTmp = {
    //     id: id,
    //     amount: Number(pdaData.amount / LAMPORTS_PER_SOL),
    //     claims: remainingClaims,
    //     numDaysLeft: daysLeft,
    //     ownerName: pdaData.ownerName,
    //     desc: pdaData.desc,
    //     tokenSymbol: "SOL",
    //     tokenIcon: images.tokens.sol,
    //   };
    //   setLifafaData(lifafaDataTmp);
    // } catch (error) {
    //   console.log("getLifafaData: ", error);
    //   setLifafaData(null);
    // }
  }

  async function handleClaim() {
    // setTransactionModalVisible(true);
    // try {
    //   const balance = await getBalance(lifafaData.tokenSymbol);
    //   const txnDataTmp = await claimLifafa(id);
    //   setTxnData(txnDataTmp);
    //   setInitialBalance(Number(balance));
    // } catch (error) {
    //   console.error("create Lifafa: ", error);
    // }
  }

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigation.push("/login");
  //   }
  // }, [isLoggedIn]);

  // useEffect(() => {
  //   if (route.params && route.params.id) {
  //     console.log("id = ", route.params.id);
  //     setId(route.params.id);
  //   }
  //   console.log("Id: ", id);
  // }, [route]);

  // useEffect(() => {
  //   if (wallet && id) {
  //     getLifafaData();
  //   }
  // }, [id, wallet]);

  if (!lifafaData) {
    return (
      <div className="min-h-screen w-[23rem] flex flex-col items-center justify-center bg-background">
        <div className="flex justify-center items-center w-full mt-24">
          <span className="font-bold text-xl">Loading ...</span>
        </div>
      </div>
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
            Best wishes, hope you win!
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
