"use client";

import { deleteLifafaInStore, retrieveLifafa } from "@/utils/firebaseHelpers";
import Card from "../../components/card";
import { useEffect, useState } from "react";
import { useCluster } from "@/providers/cluster-provider";
import { useCustomWallet } from "@/providers/custom-wallet-provider";
import { useLifafaProgram } from "@/hooks/useLifafaProgram";

const Dashboard: React.FC = () => {
  const { walletPublicKey, executeRawTransaction } = useCustomWallet();
  const { deleteLifafa } = useLifafaProgram();
  const { cluster } = useCluster();
  const [lifafaIds, setLifafaIds] = useState<string[]>([]);

  useEffect(() => {
    if(walletPublicKey){
    const unsubscribe = retrieveLifafa(cluster.networkName, walletPublicKey.toString(), setLifafaIds);
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
    }
  }, [walletPublicKey]);

  async function handleDelete(id: string) {
    if (!walletPublicKey) {
      throw new Error("Wallet not initialized");
    }
    try {
      const rawTxn = await deleteLifafa(Number(id), walletPublicKey)
      const txnHash = await executeRawTransaction(rawTxn);
      setLifafaIds((prevIds) => prevIds.filter((lifafaId) => lifafaId !== id))
      deleteLifafaInStore(cluster.networkName, walletPublicKey.toString(), id)
      console.log("Lifafa deleted")
    } catch (error) {
      console.error("create Lifafa: ", error);
    } 
  }

  // useEffect(()=>{
  //   console.log("Lifafa Ids", lifafaIds)
  // }, [lifafaIds])

  return (
    <div className="py-12 w-full h-full">
      <div className="flex flex-col w-full">
        <h1 className="text-3xl font-bold text-gray-300">My Envelopes</h1>

        {/* Card type selector */}
        {/* <div className="flex gap-8 py-8 text-white">
          <span
            onClick={() => handleSelect(1)}
            className={`cursor-pointer border-b-2 ${
              selected === 1 ? "border-blue-500" : "border-transparent"
            }`}
          >
            Sent
          </span>
          <span
            onClick={() => handleSelect(2)}
            className={`cursor-pointer border-b-2 ${
              selected === 2 ? "border-blue-500" : "border-transparent"
            }`}
          >
            Collected
          </span>
        </div> */}
      </div>

      {lifafaIds.length === 0 ? (
        <div className="text-white text-center font-semibold mt-5 items-center justify-center">No Lifafa found 🀄</div>
      ) : (
         <div className="flex flex-wrap gap-10 mt-5">
          {lifafaIds.map((id) => <Card key={id} id={id} onDelete={handleDelete}/>)}
        </div>
      )
    }
     
    </div>
  );
};

export default Dashboard;
