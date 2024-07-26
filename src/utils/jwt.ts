import jwt from "jsonwebtoken";
import nacl from "tweetnacl";
import * as anchor from "@coral-xyz/anchor";

export const createJwtToken = (address: string) => {
  return jwt.sign(
    {
      data: { address },
    },
    process.env.JWT_SECRET
  );
};

export const verifySignature = (
  message: Uint8Array,
  signature: { data: number[] },
  walletAddress: string
): boolean => {
  return nacl.sign.detached.verify(
    message,
    new Uint8Array(signature.data),
    new anchor.web3.PublicKey(walletAddress).toBytes()
  );
};
