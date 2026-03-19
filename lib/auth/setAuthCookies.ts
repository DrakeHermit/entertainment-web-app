import { cookies } from "next/headers";
import { env } from "@/lib/env";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function setAuthCookies(token: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: env.JWT_EXPIRATION_TIME,
  });
  cookieStore.set("refresh_token", refreshToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: env.REFRESH_TOKEN_EXPIRATION_TIME,
  });
}
