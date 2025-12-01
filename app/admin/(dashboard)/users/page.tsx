import { authorize } from "@/lib/auth/authorize";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/permissions";
import { Suspense } from "react";
import UserTable from "./components/UserTable";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

async function UsersTable() {
  const res = await auth.api.listUsers({
    query: {},
    headers: await headers(),
  });

  const data = res.users.map((user) => ({
    id: user.id,
    name: user.name || "No Name",
    email: user.email,
    createdAt: user.createdAt,
    role: user.role,
    active: user.emailVerified,
  }));

  return <UserTable data={data} isLoading={false} />;
}

export default async function UsersPage() {
  const { authorized, session } = await authorize();

  if (!authorized) {
    redirect("/admin/login");
  }

  if (!hasPermission(session, "users.manage")) {
    redirect("/admin");
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">User Management</h1>
        <p className="text-lg font-light text-secondary-foreground/70">
          Welcome to the user management page. Here you can manage users and
          their roles.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <Suspense fallback={<UserTable data={[]} isLoading={true} />}>
          <UsersTable />
        </Suspense>
      </div>
    </div>
  );
}
