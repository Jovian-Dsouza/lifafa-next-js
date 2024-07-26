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
  console.log(
    JSON.stringify({
      signature,
      wallet_address: wallet_address,
    }),
  );
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
