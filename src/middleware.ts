import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuth,
  authRoutes,
  publicRoutes,
} from "../routes";
import supabaseGetUser from "./actions/supabase/supabase-get-user";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const user = await supabaseGetUser();

  const isLoggedIn = user;
  const { nextUrl } = request;

  const isAPIAuthRoute = apiAuth.find((item) =>
    nextUrl.pathname.includes(item)
  );

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  //

  if (isAPIAuthRoute) return null;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
