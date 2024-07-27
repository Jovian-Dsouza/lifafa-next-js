import axios from "axios";

export const checkUser = async (wallet_address: string): Promise<boolean> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/checkuser`,
    {
      wallet_address: wallet_address,
    },
  );
  if (response && response.status === 200) {
    return response.data.userFound as boolean;
  }
  return false;
};

export const signinUser = async (
  wallet_address: string,
  signature: any,
): Promise<string | null> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/login`,
    {
      signature,
      wallet_address: wallet_address,
    },
  );

  if (response && response.status === 200) {
    return response.data.token;
  }
  return null;
};

export const saveLifafa = async (lifafaData: {
  id: string;
  creation_time: string;
  time_limit: string;
  owner: string;
  owner_name: string;
  max_claims: string;
  mint_of_token_being_sent: string;
  amount: string;
  desc: string;
  claim_mode: "Random" | "Equal";
  wallet_address: string;
}): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lifafa`,
      lifafaData,
    );

    if (response && response.status === 200) {
      return response.data.message;
    }
    return null;
  } catch (error) {
    console.error("Failed to create lifafa:", error);
    return null;
  }
};
