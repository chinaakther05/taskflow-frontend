
import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If accessToken exists in cookie,
  // don't allow authenticated users to stay on login/register.
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(
      new URL("/Admin", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
  ],
};

