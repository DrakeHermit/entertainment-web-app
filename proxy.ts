import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/bookmarks", "/profile"];

function hasAuthCookies(request: NextRequest): boolean {
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  return !!token || !!refreshToken;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasAuthCookies(request);

  if (authenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !authenticated &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/bookmarks/:path*", "/profile/:path*"],
};
