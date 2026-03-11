import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/bookmarks", "/profile"];

async function isAuthenticated(
  request: NextRequest
): Promise<{ valid: boolean; staleToken: boolean }> {
  const token = request.cookies.get("token")?.value;
  if (!token) return { valid: false, staleToken: false };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const { userId } = decoded as { userId: string };

    const user = await db
      .select({ jwt_token: users.jwt_token })
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (!user[0] || user[0].jwt_token !== token) {
      return { valid: false, staleToken: true };
    }

    return { valid: true, staleToken: false };
  } catch {
    return { valid: false, staleToken: true };
  }
}

function clearTokenCookie(response: NextResponse): NextResponse {
  response.cookies.delete("token");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { valid, staleToken } = await isAuthenticated(request);

  if (valid && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !valid &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return clearTokenCookie(
      NextResponse.redirect(new URL("/login", request.url))
    );
  }

  if (staleToken) {
    return clearTokenCookie(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/bookmarks/:path*", "/profile/:path*"],
};
