import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const refreshToken = cookieStore.get("refresh_token");

  const debug: Record<string, unknown> = {
    hasTokenCookie: !!token?.value,
    hasRefreshCookie: !!refreshToken?.value,
    tokenLength: token?.value?.length ?? 0,
    refreshLength: refreshToken?.value?.length ?? 0,
    envVars: {
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasRefreshSecret: !!process.env.REFRESH_TOKEN_SECRET,
      hasDbUrl: !!process.env.DATABASE_URL,
      hasJwtExpTime: !!process.env.JWT_EXPIRATION_TIME,
      hasRefreshExpTime: !!process.env.REFRESH_TOKEN_EXPIRATION_TIME,
      nodeEnv: process.env.NODE_ENV,
    },
  };

  if (token?.value && process.env.JWT_SECRET) {
    try {
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
      debug.tokenVerification = { valid: true, payload: decoded };
    } catch (err) {
      debug.tokenVerification = {
        valid: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  if (refreshToken?.value && process.env.REFRESH_TOKEN_SECRET) {
    try {
      const decoded = jwt.verify(refreshToken.value, process.env.REFRESH_TOKEN_SECRET);
      debug.refreshVerification = { valid: true, payload: decoded };
    } catch (err) {
      debug.refreshVerification = {
        valid: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  return NextResponse.json(debug);
}
