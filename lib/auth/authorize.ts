import { Session } from "./server";
import { headers } from "next/headers";
import { auth } from "./server";

export type PartialSession = {
  user: Pick<Session["user"], "id" | "email" | "role">;
};

export type AuthorizeResult = {
  authorized: boolean;
  type: "auth";
  session: Session | null;
};

export async function authorize(): Promise<AuthorizeResult> {
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
