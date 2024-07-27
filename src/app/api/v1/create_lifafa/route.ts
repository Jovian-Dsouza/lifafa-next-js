import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const CreateLifafaBody = z.object({
  id: z.string().transform((str) => BigInt(str)),
  creation_time: z.string().transform((str) => BigInt(str)),
  time_limit: z.string().transform((str) => BigInt(str)),
  owner: z.string(),
  owner_name: z.string(),
  max_claims: z.string().transform((str) => BigInt(str)),
  mint_of_token_being_sent: z.string(),
  amount: z.string().transform((str) => BigInt(str)),
  desc: z.string(),
  claim_mode: z.enum(["Random", "Equal"]),
  wallet_address: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const lifafaData = CreateLifafaBody.parse(await req.json());
    // const lifafaData = await req.json();
    // console.log(lifafaData)

    await prisma.lifafa.create({
      data: {
        id: lifafaData.id,
        creation_time: lifafaData.creation_time,
        time_limit: lifafaData.time_limit,
        owner: lifafaData.owner,
        owner_name: lifafaData.owner_name,
        max_claims: lifafaData.max_claims,
        mint_of_token_being_sent: lifafaData.mint_of_token_being_sent,
        amount: lifafaData.amount,
        desc: lifafaData.desc,
        claim_mode: lifafaData.claim_mode,
        wallet_address: lifafaData.wallet_address,
      },
    });

    return NextResponse.json({ message: "successfully created" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
