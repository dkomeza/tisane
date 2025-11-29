import { NextRequest } from "next/server";
import { Session } from "./server";
import { cookies, headers } from "next/headers";
import { auth } from "./server";

type PartialSession = {
  user: Pick<Session["user"], "id" | "email" | "role">;
};

export type AuthorizeResult =
  | {
      authorized: boolean;
      type: "auth";
      session: Session | null;
    }
  | {
      authorized: true;
      type: "key";
      session: PartialSession;
    };

export async function authorize(): Promise<AuthorizeResult> {
  const cookieStore = await cookies();

  const adminAuthToken = cookieStore.get("admin_auth_token")?.value;
  if (adminAuthToken && adminAuthToken === process.env.TEMPORARY_ADMIN_KEY) {
    return {
      authorized: true,
      type: "key",
      session: {
        user: {
          id: "temporary-admin",
          email: "temp@admin.com",
          role: "admin",
        },
      },
    };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      authorized: false,
      type: "auth",
      session: null,
    };
  }

  return {
    authorized: true,
    type: "auth",
    session,
  };
}
