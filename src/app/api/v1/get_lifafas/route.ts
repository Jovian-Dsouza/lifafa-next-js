import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const GetLifafaByUserQuery = z.object({
  wallet_address: z.string(),
});

// Helper function to convert BigInt to string in an object
function convertBigIntToString(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET(req: NextRequest) {
  try {
    // const cookies = req.cookies;
    // const walletAddress = cookies.get("x-wallet-address");
    // console.log("cookies", walletAddress);

    const { searchParams } = new URL(req.url);
    const wallet_address = searchParams.get("wallet_address");
    if(!wallet_address){
      return NextResponse.json({ error: "No wallet address found" }, { status: 400 });
    }
    const lifafas = await prisma.lifafa.findMany({
      where: { wallet_address },
    });
    const lifafasConverted = lifafas.map(convertBigIntToString);

    return NextResponse.json({ data: lifafasConverted }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
