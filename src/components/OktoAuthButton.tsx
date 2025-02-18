"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { OktoContextType, useOkto } from "okto-sdk-react";
import Image from "next/image";

const LogoutButton = ({ onClick }: { onClick: () => void }) => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    onClick();
    setIsSigningOut(false);
  };

  return (
    <button
      onClick={handleSignOut}
      className={`px-4 py-2 bg-gray-700 text-white rounded-lg font-bold shadow-md transition duration-300 ease-in-out transform hover:bg-gray-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
        isSigningOut ? "cursor-not-allowed opacity-50" : ""
      }`}
      disabled={isSigningOut}
    >
      {isSigningOut ? (
        <svg
          className="animate-spin h-5 w-5 mr-3 text-white inline"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V4z"
          ></path>
        </svg>
      ) : (
        <div className="flex items-center space-x-2">
          <Image src="/okto.png" alt="Logo" width={30} height={30} />
          <span className="">Log Out</span>
        </div>
      )}
    </button>
  );
};

const LoginButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg font-bold shadow-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <Image src="/okto.png" alt="Logo" width={30} height={30} />
    <span className="ml-2">Log In</span>
  </button>
);

function OktoAuthButton() {
  const { data: session } = useSession();
  const idToken = useMemo(() => (session ? session.id_token : null), [session]);
  const { isLoggedIn, authenticate, logOut } = useOkto() as OktoContextType;

  async function handleAuthenticate() {
    if (!idToken) {
      console.log("no idtoken");
      return;
    }
    authenticate(idToken, (result: any, error: any) => {
      if (result) {
        console.log("Authentication successful");
      } else if (error) {
        console.error("Authentication error:", error);
      }
    });
  }

  async function handleSignOut() {
    try {
      logOut();
      signOut();
      return { result: "logout success" };
    } catch (error) {
      return { result: "logout failed" };
    }
  }

  useEffect(() => {
    // console.log("Idtoken", idToken);
    // console.log("isLoggedIn", isLoggedIn)

    const timeOut = setTimeout(() => {
      if (idToken && !isLoggedIn) {
        console.log("Authenticate called");
        handleAuthenticate();
      }
    }, 500);

    return () => clearTimeout(timeOut);
  }, [idToken, isLoggedIn]);

  return (
    <div className="flex justify-center items-center text-white">
      {session ? (
        <LogoutButton onClick={handleSignOut} />
      ) : (
        <LoginButton onClick={() => signIn("google")} />
      )}
    </div>
  );
}

export default OktoAuthButton;
