import React, { useEffect, useState } from "react";
import styles from "../styles/Card.module.scss";
import { getTokenByAddress, Token, tokens } from "@/data/constants";
import Image from "next/image";
import { TrashIcon } from "lucide-react";
import { useLifafaProgram } from "@/hooks/useLifafaProgram";
import dayjs from "dayjs";
import { getTokenPrice } from "@/utils/jupiter-price";
import { copyToClipboard, openClaimPage } from "@/utils/share";

interface LifafaData {
  id: string;
  numDaysLeft: number;
  amount: number;
  price: number;
  claimed: number;
  maxClaims: number;
  desc: string;
  token: Token;
}

const Card = ({ id , onDelete}: { id: string, onDelete: (id: string) => void }) => {
  const { fetchLifafa } = useLifafaProgram();
  const [lifafaData, setLifafaData] = useState<null | LifafaData>();

  async function getLifafaData() {
    try {
      const lifafaId = Number(id)
      const pdaData = await fetchLifafa(lifafaId);
      if(!pdaData){
        return;
      }
      const token = getTokenByAddress(pdaData.mintOfTokenBeingSent.toString())
      if(!token){
        return;
      }
      const tokenPrice = await getTokenPrice(token.address);
      // console.log("pdaData: ", pdaData);
      const expiryTime = dayjs.unix(
        Number(pdaData.creationTime) + Number(pdaData.timeLimit)
      );
      const daysLeft = expiryTime.diff(dayjs(), "day");
      const amount = Number(pdaData.amount / (10 ** token.decimals))
      const price = amount * tokenPrice
      const lifafaDataTmp: LifafaData = {
        id: id,
        numDaysLeft: daysLeft,
        amount,
        price,
        claimed: pdaData.claims.toNumber(),
        maxClaims: pdaData.maxClaims.toNumber(),
        desc: pdaData.desc,
        token: token,
      };

      setLifafaData(lifafaDataTmp);
    } catch (error) {
      console.log("getLifafaData: ", error);
    }
  }

  function handleDelete(){
    onDelete(id);
  }

  useEffect(()=>{
    getLifafaData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(!lifafaData){
    return null;
  }

  return (
    <div className="relative w-full sm:w-[21rem]">
      <div className="absolute -top-1 right-3 w-16 py-0.5 px-2 rounded-b-lg rounded-tr-sm bg-red-500 z-10">
        <p className="text-white text-xs text-center font-semibold">
          {lifafaData.numDaysLeft} Days
        </p>
      </div>
      <div className="flex  p-4 flex-col items-start gap-4 flex-shrink-0 bg-blue-100 rounded-lg">
        {/* Inner Card */}
        <div className="flex gap-3 w-full justify-between items-center">
          {/* Image Container */}
          <div className="flex justify-center items-center gap-4">
            {/*  Image */}
            <div className="relative">
              <Image
                src={lifafaData.token.icon}
                alt="Token Icon"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 border-2 border-white rounded-full">
                <Image
                  src={lifafaData.token.blockchainIcon}
                  alt="Blockchain Icon"
                  width={16}
                  height={16}
                  className="rounded-full"
                />
              </div>
            </div>
            {/* Text Columns */}
            <div className="flex flex-col">
              <span className="text-gray-900 text-sm font-bold leading-5">{lifafaData.amount} {lifafaData.token.symbol}</span>
              <span className="text-gray-500 text-xs font-normal leading-4 mt-1">{lifafaData.price.toFixed(2)} USDC</span>
            </div>
          </div>

          <TrashIcon onClick={handleDelete} className="w-4 h-4 text-gray-600 hover:text-red-600"/>
        </div>

        {/* Progress Slider */}
        <div className="flex gap-4 items-center justify-between w-full">
          <progress
            className={styles.progressBar}
            max={lifafaData.maxClaims}
            value={lifafaData.claimed}
          ></progress>
          <div className="text-gray-500 text-xs font-normal leading-4">{lifafaData.claimed}/{lifafaData.maxClaims} claimed</div>
        </div>

        {/* Description */}
        <div className="flex w-full h-6 flex-col justify-end">
          <span className="text-gray-500 text-sm font-normal leading-6 truncate">
            {lifafaData.desc}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-between w-full">
          <button onClick={() => copyToClipboard(id)} className="flex h-8 w-36 justify-center items-center gap-1 flex-1 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition duration-150">
            <span className="text-gray-900 text-xs font-medium leading-4">Copy Link</span>
          </button>
          <button onClick={() => openClaimPage(id)} className="flex h-8 w-36 justify-center items-center gap-1 flex-1 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition duration-150">
            <span className="text-gray-900 text-xs font-medium leading-4">Share</span>
          </button>
        </div>
      </div>
    </div>
    
  );
};

export default Card;
