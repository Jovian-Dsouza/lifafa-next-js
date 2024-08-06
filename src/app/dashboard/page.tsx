"use client";

import { deleteLifafaInStore, retrieveLifafa } from "@/utils/firebaseHelpers";
import Card from "../../components/card";
import { useEffect, useState } from "react";
import { useCluster } from "@/providers/cluster-provider";
import { useCustomWallet } from "@/providers/custom-wallet-provider";
import { useLifafaProgram } from "@/hooks/useLifafaProgram";
import { useRouter } from "next/navigation";

const NoLifafaFound: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      {/* <img src="/no-data.svg" alt="No Data" className="w-32 h-32 mb-4" /> */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No Lifafa Found 🀄</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        It looks like you have not created any lifafas yet.
      </p>
      <button
        onClick={() => router.push('/')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Create Lifafa
      </button>
    </div>
  );
};


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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  //   console.log(lifafaIds)
  // }, [lifafaIds])

  return (
    <div className="py-6 md:py-12 w-full h-full">
      {lifafaIds.length === 0 ? (
        <NoLifafaFound />
      ) : (
        <div className="flex flex-col w-full">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Lifafas</h1>
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
        )
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 xl:gap-32 mt-5">
        {lifafaIds.map((id) => <Card key={id} id={id} onDelete={handleDelete} />)}
      </div>
    </div>
  );
};

export default Dashboard;
