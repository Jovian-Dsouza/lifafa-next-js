import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET),
};

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  try {
    if (url.pathname.startsWith("/api/v1/login")) {
      return NextResponse.next();
    }

    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is required" },
        { status: 401 },
      );
    }

    try {
      const decoded = await jose.jwtVerify(token, jwtConfig.secret);
      const wallet_address = (decoded.payload.data as any).address;
      const response = NextResponse.next();
      response.headers.set("X-Wallet-Address", wallet_address);
      return response;
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { error: "Invalid auth token" },
        { status: 401 },
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const config = {
  matcher: "/api/:path*", // Apply to all API routes
};
