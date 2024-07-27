"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { tokenAtom } from "@/store/atoms/appAtoms";
import { useCustomWallet } from "../providers/custom-wallet-provider";
import { getAuthDetails, storeAuthDetails } from "../utils/storage-helper";
import { signinUser } from "@/utils/api-helper";

interface AuthContextProps {
  walletAddress: string | null;
  token: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { walletAddress, getSignature } = useCustomWallet();
  const [token, setToken] = useRecoilState(tokenAtom);

  async function registerUser() {
    if (!walletAddress) {
      return;
    }
    try {
      const signature = await getSignature();
      // console.log("signature", signature)
      if (!signature) {
        console.error("couldnt get signature");
        return;
      }
      const token = await signinUser(walletAddress, signature);
      // console.log("token", token)
      if (token) {
        storeAuthDetails({
          token,
          wallet_address: walletAddress,
        });
        setToken(token);
      } else {
        console.error("Failed to register user");
      }
    } catch (error: unknown) {
      console.error("Failed to register user", error);
    }
  }

  const checkLogin = async () => {
    if (walletAddress) {
      const authDetailsFromStorage = await getAuthDetails();
      if (
        authDetailsFromStorage &&
        authDetailsFromStorage.wallet_address === walletAddress &&
        authDetailsFromStorage.token
      ) {
        setToken(authDetailsFromStorage.token);
      } else {
        registerUser();
      }
    }
  };

  useEffect(() => {
    checkLogin();
    const timer = setTimeout(() => {
      if (!walletAddress) {
        registerUser();
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  // useEffect(() => {
  //   console.log("Token", token);
  //   console.log("wallet", walletAddress)
  // }, [token, walletAddress]);

  return (
    <AuthContext.Provider value={{ walletAddress, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
