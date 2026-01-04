import { NextRequest, NextResponse } from "next/server";
import { authorize } from "./lib/auth/authorize";
import { isSetupComplete } from "./lib/is-setup";

function isAdminRoute(pathname: string) {
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    return true;
  }

  if (pathname.startsWith("/admin")) {
    const adminExclusions = [
      "/admin/login",
      "/admin/signup",
      "/admin/forgot-password",
      "/admin/reset-password",
      "/admin/onboarding",
    ];

    if (adminExclusions.some((route) => pathname.startsWith(route))) {
      return false;
    }

    return true;
  }

  return false;
}

function isOnboardingRoute(pathname: string) {
  return pathname.startsWith("/admin/onboarding");
}

export async function proxy(request: NextRequest) {
  if (
    !(await isSetupComplete()) &&
    !isOnboardingRoute(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/admin/onboarding", request.url));
  }

  if (!isAdminRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const authResult = await authorize();

  if (!authResult.authorized) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
