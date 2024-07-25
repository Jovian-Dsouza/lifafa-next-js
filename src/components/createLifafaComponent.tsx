import { useState, useMemo } from "react";
import { ClaimMode, useLifafaProgram } from "../hooks/useLifafaProgram";
import { getRandomId } from "@/utils/random";
// import { useAppContext } from "../providers/AppContextProvider";
import { tokens } from "@/data/constants";
// import { useWallet } from "../providers/WalletProvider";
// import { storeLifafa } from "../utils/firestoreUtils";
// import { handleCopyLink, handleShare } from "../utils/share";
import dayjs from "dayjs";

import { MultilineTextInput } from "./MultilineTextInput";
// import { TransactionRequestModal } from "./TransactionRequestModal";
// import { EnvelopeModal } from "./EnvelopeModal";
import { TokenSelector } from "./TokenSelector";
import { AmountInput } from "./AmountInput";
import { MaxClaimsInput } from "./MaxClaimsInput";
import { CustomDatePicker } from "./CustomDatePicker";
import { CreateButton } from "./CreateButton";
import TokenBalance from "./TokenBalance";
import { EnvelopeModal } from "./EnvelopeModal";
import { openDailect } from "@/utils/share";
import { PublicKey } from "@solana/web3.js";
// import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";

export const CreateLifafaComponent = () => {
  //   const { executeRawTransactionWithJobStatus } = useOkto();
  const {
    program: lifafaProgram,
    createLifafa,
    claimLifafa,
  } = useLifafaProgram();
  const [amount, setAmount] = useState(0);
  const [maxClaims, setMaxClaims] = useState<number | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [desc, setDesc] = useState("");
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [envelopeModalVisible, setEnvelopModalVisible] = useState(false);
  const [id, setId] = useState("");
  //   const { user } = useAppContext();
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [txnData, setTxnData] = useState();

  //   const fee = useMemo(() => {
  //     if (txnData) {
  //       return txnData.fee;
  //     }
  //     return "0";
  //   }, [txnData]);

  const timeLeft = useMemo(() => {
    if (time) {
      return dayjs(time).diff(dayjs(), "second");
    }
    return 0;
  }, [time]);

  const isCreateDisabled = useMemo(() => {
    return (
      amount === 0 ||
      !maxClaims ||
      desc === "" ||
      time === null ||
      !lifafaProgram
    );
  }, [amount, maxClaims, time, desc, lifafaProgram]);

  async function handleCreate() {
    // setTransactionModalVisible(true);
    const createLifafaData = {
      id: getRandomId(),
      amount: Number(amount),
      timeleft: timeLeft,
      maxClaims: Number(maxClaims),
      ownerName: "lifafa",
      desc: desc,
    };
    console.log("CreateLifafaData: ", createLifafaData);
    try {
      const txnDataTmp = await createLifafa(
        createLifafaData.id,
        createLifafaData.amount,
        createLifafaData.timeleft,
        createLifafaData.maxClaims,
        createLifafaData.ownerName,
        createLifafaData.desc,
        ClaimMode.Random,
        new PublicKey(selectedToken.address),
      );
      setEnvelopModalVisible(true);
      setId(createLifafaData.id.toString());
    } catch (error) {
      console.error("create Lifafa: ", error);
    }
  }

  async function handleClaim() {
    try {
      const txnDataTmp = await claimLifafa(7620951291);
    } catch (error) {
      console.error("create Lifafa: ", error);
    }
  }

  return (
    <div className="w-[22rem] bg-[#F5F6FE]  rounded-3xl p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black">Create Lifafa</h2>
        <TokenBalance token={selectedToken} />
      </div>

      {/* Token Selector and price */}
      <div className="bg-white border border-gray-200 p-3 rounded-2xl flex items-center justify-between mb-4">
        <TokenSelector
          token={selectedToken}
          onSelect={(token: any) => setSelectedToken(token)}
        />

        <AmountInput
          amount={amount}
          setAmount={setAmount}
          token={selectedToken}
        />
      </div>

      <MaxClaimsInput maxClaims={maxClaims} onChangeMaxClaims={setMaxClaims} />

      <p className="text-center text-[#707070] text-xs mb-4">
        Each gets a random amount from the total.
      </p>

      <CustomDatePicker time={time} setTime={setTime} />

      {/* Description */}
      <MultilineTextInput text={desc} setText={setDesc} maxLength={50} />

      <CreateButton
        onPress={() => handleCreate()}
        disabled={isCreateDisabled}
      />

      {/* <CreateButton onPress={() => handleClaim()} disabled={false} /> */}

      {/* Modals */}
      <EnvelopeModal
        amount={amount}
        tokenSymbol={selectedToken.symbol}
        tokenIcon={selectedToken.icon}
        timeLeft={timeLeft}
        maxClaims={maxClaims ? maxClaims : 0}
        visible={envelopeModalVisible}
        setVisible={setEnvelopModalVisible}
        onCopyLink={() => {}}
        onShare={() => {
          openDailect(id);
        }}
      />
    </div>
  );
};
