import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type RouteContext = {
  params: Promise<{ key: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { key } = await params;

  if (key !== process.env.TEMPORARY_ADMIN_URL) {
    return new Response(`Unauthorized: ${key}`, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_auth_token", process.env.TEMPORARY_ADMIN_KEY || "");

  redirect("/admin");
}
