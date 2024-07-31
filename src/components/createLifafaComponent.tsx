import { useState, useMemo, useEffect } from "react";
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
import { useOktoWallet } from "@/providers/custom-okto-wallet-provider";
import { OktoContextType, useOkto } from "okto-sdk-react";
// import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";

const shortenWalletAddress = (address: string): string => {
  if (address.length <= 8) {
    return "lifafa";
  }
  const start = address.slice(0, 4);
  const end = address.slice(-4);
  return `${start}...${end}`;
};

export const CreateLifafaComponent = () => {
  const { executeRawTransactionWithJobStatus, orderHistory, isLoggedIn } =
    useOkto() as OktoContextType;
  const [walletPublicKey, setWalletPublicKey] = useState<PublicKey | null>(
    null,
  );
  const { getWalletForSelectedCluster } = useOktoWallet();
  const {
    program: lifafaProgram,
    createLifafa,
    claimLifafa,
  } = useLifafaProgram(walletPublicKey);
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
  // const {walletAddress} = useCustomWallet();

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        const walletPublicKeyTemp = await getWalletForSelectedCluster();
        // console.log("wallet public key", walletPublicKeyTemp.address);
        if (walletPublicKeyTemp && walletPublicKeyTemp.address) {
          setWalletPublicKey(new PublicKey(walletPublicKeyTemp.address));
        }
      })();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    console.log("wallet public key", walletPublicKey?.toString());
  }, [walletPublicKey]);

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
    console.log("walletpublickey", walletPublicKey);
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
        walletPublicKey
      );
      console.log("raw Txn", rawTxn);
      const jobStatus = await executeRawTransactionWithJobStatus(rawTxn)
      console.log(jobStatus)
      // setEnvelopModalVisible(true);
      // setId(createLifafaData.id.toString());
      // await saveLifafa({
      //   id: createLifafaData.id.toString(),
      //   creation_time: '', //current timestamp
      //   time_limit: createLifafaData.timeleft.toString(),
      //   owner: walletAddress? walletAddress: '',
      //   owner_name: shortenWalletAddress(walletAddress? walletAddress: ''),
      //   max_claims: createLifafaData.maxClaims.toString(),
      //   mint_of_token_being_sent: walletAddress? walletAddress: '',
      //   amount: createLifafaData.amount.toString(),
      //   desc: createLifafaData.desc.toString(),
      //   claim_mode: "Random",
      //   wallet_address: walletAddress? walletAddress: ''
      // });
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
        {/* <TokenBalance token={selectedToken} /> */}
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
