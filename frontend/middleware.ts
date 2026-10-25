import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE_NAME = "helpdesk_token";
const PROTECTED_PREFIXES = ["/dashboard", "/tickets", "/admin"];
const GUEST_ONLY_PATHS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isGuestOnly = GUEST_ONLY_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestOnly && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tickets/:path*", "/admin/:path*", "/login", "/register"],
};