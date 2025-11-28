import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths starting with /api
     * BUT EXCLUDE any path starting with /api/auth
     */
    "/api/((?!auth).*)",

    /* Match the /admin path */
    "/admin",

    /*
     * Match all request paths starting with /admin/
     * BUT EXCLUDE any path starting with /admin/login, /admin/signup or /admin/forgot-password
     */
    "/admin/((?!login|signup|forgot-password).*)",
  ],
};
