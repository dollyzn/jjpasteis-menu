import { NextRequest, NextResponse } from "next/server";
import { decode } from "./lib/jwt";
import { cookies } from "next/headers";

const protectedRoutes = ["/"];
const publicRoutes = ["/auth/login"];

const cookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME;

export async function middleware(req: NextRequest) {
  if (!cookieName)
    throw new Error("NEXT_PUBLIC_AUTH_COOKIE_NAME must be defined in .env");

  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get(cookieName)?.value;
  const session = await decode(cookie);

  if (isProtectedRoute && !session?.token) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.token &&
    !req.nextUrl.pathname.startsWith("/")
  ) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};