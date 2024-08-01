"use client";

import Card from "../../components/card";
import styles from "@/styles/Dashboard.module.scss";
import { retrieveLifafa } from "@/utils/firebaseHelpers";
import { useEffect, useState } from "react";

type OptionType = 1 | 2;

const Dashboard: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const walletPublicKey = "user-wallet-public-key1"; // Replace with actual wallet public key
  const type = "created"; // or 'sent'

  // useEffect(() => {
  //   const unsubscribe = retrieveLifafa(walletPublicKey, setData, type);
  //   return () => {
  //     if (unsubscribe) {
  //       unsubscribe();
  //     }
  //   };
  // }, [walletPublicKey, type]);

  const [selected, setSelected] = useState<OptionType>(1);

  const handleSelect = (option: OptionType) => {
    setSelected(option);
  };
  return (
    <div className={styles.dashboardSection}>
      <div className={styles.container}>
        <h1>My Envelopes</h1>
        <div className={styles.select}>
          <span
            onClick={() => handleSelect(1)}
            className={selected === 1 ? styles.selected : ""}
          >
            Sent
          </span>
          <span
            onClick={() => handleSelect(2)}
            className={selected === 2 ? styles.selected : ""}
          >
            Collected
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-10">
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default Dashboard;
