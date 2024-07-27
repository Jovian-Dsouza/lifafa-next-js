import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SIGN_MESSAGE } from "@/data/constants";
import { createJwtToken, verifySignature } from "@/utils/jwt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { wallet_address, signature } = await req.json();

  try {
    const message = new TextEncoder().encode(SIGN_MESSAGE);

    if (!verifySignature(message, signature, wallet_address)) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { wallet_address },
    });
    if (!user) {
      await prisma.user.create({
        data: {
          wallet_address,
        },
      });
    }
    const token = createJwtToken(wallet_address);

    return NextResponse.json({ token }, { status: 200 });
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
