import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is a dashboard route
  if (pathname.startsWith("/dashboard")) {
    // Get the session token from cookies
    const sessionToken = request.cookies.get(
      "better-auth.session_token",
    )?.value;

    // If no session token, redirect to login
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If on login page and already authenticated, redirect to dashboard
  if (pathname === "/login") {
    const sessionToken = request.cookies.get(
      "better-auth.session_token",
    )?.value;

    if (sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
