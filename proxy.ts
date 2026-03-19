import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { users } from "@/lib/db/schema";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/bookmarks", "/profile"];

const jwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshSecret = () => new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);

function getDb() {
  return drizzle(process.env.DATABASE_URL!);
}

async function verifyToken(token: string, secret: Uint8Array) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string };
  } catch {
    return null;
  }
}

async function signToken(userId: string, secret: Uint8Array, expiresIn: number) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${expiresIn}s`)
    .sign(secret);
}

function setAccessTokenCookie(response: NextResponse, accessToken: string) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set("token", accessToken, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    maxAge: parseInt(process.env.JWT_EXPIRATION_TIME!),
    path: "/",
  });
  return response;
}

function clearCookies(response: NextResponse) {
  response.cookies.delete("token");
  response.cookies.delete("refresh_token");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  let isAuthenticated = false;

  if (token) {
    const payload = await verifyToken(token, jwtSecret());
    if (payload) {
      isAuthenticated = true;
    }
  }

  if (!isAuthenticated && refreshToken) {
    const payload = await verifyToken(refreshToken, refreshSecret());
    if (payload) {
      const database = getDb();
      const user = await database
        .select({ id: users.id, refresh_token: users.refresh_token })
        .from(users)
        .where(eq(users.id, parseInt(payload.userId)))
        .limit(1);

      if (user[0] && user[0].refresh_token === refreshToken) {
        const expTime = parseInt(process.env.JWT_EXPIRATION_TIME!);

        const newAccessToken = await signToken(user[0].id.toString(), jwtSecret(), expTime);

        await database
          .update(users)
          .set({ jwt_token: newAccessToken })
          .where(eq(users.id, user[0].id));

        isAuthenticated = true;

        const redirectUrl = authRoutes.includes(pathname)
          ? new URL("/", request.url)
          : request.nextUrl;

        return setAccessTokenCookie(
          NextResponse.redirect(redirectUrl),
          newAccessToken
        );
      } else {
        if (user[0]) {
          await database
            .update(users)
            .set({ jwt_token: null, refresh_token: null })
            .where(eq(users.id, user[0].id));
        }

        const response = protectedRoutes.some((route) => pathname.startsWith(route))
          ? NextResponse.redirect(new URL("/login", request.url))
          : NextResponse.next();

        return clearCookies(response);
      }
    }
  }

  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return clearCookies(NextResponse.redirect(new URL("/login", request.url)));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
