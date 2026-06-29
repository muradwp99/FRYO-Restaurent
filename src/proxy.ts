import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, verifyAccountSession, SESSION_COOKIE, ACCOUNT_COOKIE } from "@/lib/session";

/**
 * Auth gate. Runs before routes render so unauthenticated requests never reach
 * the page or its data fetching. Layouts + server actions re-check as defense
 * in depth.
 *  - /fryo-kanji/*  → admin session (redirect to /login)
 *  - /account/*     → customer session (redirect to /account/login), except the
 *                     login/register pages themselves.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Customer account area
  if (pathname === "/account" || pathname.startsWith("/account/")) {
    if (pathname === "/account/login" || pathname === "/account/register") {
      return NextResponse.next();
    }
    const account = await verifyAccountSession(request.cookies.get(ACCOUNT_COOKIE)?.value);
    if (!account) {
      const url = new URL("/account/login", request.url);
      url.searchParams.set("from", pathname + search);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Admin area
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/fryo-kanji", "/fryo-kanji/:path*", "/account", "/account/:path*"],
};
