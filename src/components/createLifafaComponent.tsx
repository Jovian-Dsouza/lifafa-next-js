import { useState, useMemo } from "react";
import { ClaimMode, useLifafaProgram } from "../hooks/useLifafaProgram";
import { getRandomId } from "@/utils/random";
import { tokens } from "@/data/constants";
import dayjs from "dayjs";
import { MultilineTextInput } from "./MultilineTextInput";
import { TokenSelector } from "./TokenSelector";
import { AmountInput } from "./AmountInput";
import { MaxClaimsInput } from "./MaxClaimsInput";
import { CustomDatePicker } from "./CustomDatePicker";
import { CreateButton } from "./CreateButton";
import TokenBalance from "./TokenBalance";
import { EnvelopeModal } from "./EnvelopeModal";
import { openDailect } from "@/utils/share";
import { PublicKey } from "@solana/web3.js";
import { storeLifafa } from "@/utils/firebaseHelpers";
import { useCustomWallet } from "@/providers/custom-wallet-provider";
import { useCluster } from "@/providers/cluster-provider";

export const CreateLifafaComponent = () => {
  const { walletPublicKey, executeRawTransaction, userName } = useCustomWallet();
  const {
    program: lifafaProgram,
    createLifafa,
    claimLifafa,
  } = useLifafaProgram(walletPublicKey);
  const [amount, setAmount] = useState(0);
  const [maxClaims, setMaxClaims] = useState<number | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [desc, setDesc] = useState("");
  const [envelopeModalVisible, setEnvelopModalVisible] = useState(false);
  const [id, setId] = useState("");
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const { cluster } = useCluster();

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
      !lifafaProgram ||
      !walletPublicKey
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, maxClaims, time, desc, lifafaProgram]);

  async function handleCreate() {
    if (!walletPublicKey) {
      throw new Error("Wallet not initialized");
    }
    const createLifafaData = {
      id: getRandomId(),
      amount: Number(amount),
      timeleft: timeLeft,
      maxClaims: Number(maxClaims),
      ownerName: userName,
      desc: desc,
    };
    // console.log("CreateLifafaData: ", createLifafaData);
    // console.log("walletpublickey", walletPublicKey);
    try {
      const rawTxn = await createLifafa(
        createLifafaData.id,
        createLifafaData.amount * 10 ** selectedToken.decimals,
        createLifafaData.timeleft,
        createLifafaData.maxClaims,
        createLifafaData.ownerName,
        createLifafaData.desc,
        ClaimMode.Random,
        new PublicKey(selectedToken.address),
      );
      const txnHash = await executeRawTransaction(rawTxn);

      storeLifafa(
        cluster.networkName,
        walletPublicKey.toString(),
        createLifafaData.id.toString(),
        txnHash,
      );
      setEnvelopModalVisible(true);
      setId(createLifafaData.id.toString());
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
