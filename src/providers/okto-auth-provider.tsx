"use client";
import React, { ReactNode } from "react";
import { OktoProvider, BuildType } from "okto-sdk-react";
import { SessionProvider } from "next-auth/react";

export const OktoAuthProvider = ({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) => {
  const apiKey = process.env.NEXT_PUBLIC_OKTO_CLIENT_API!;
  const buildType = BuildType.SANDBOX;

  return (
    <SessionProvider session={session}>
      <OktoProvider apiKey={apiKey} buildType={buildType}>
        {children}
      </OktoProvider>
    </SessionProvider>
  );
};
