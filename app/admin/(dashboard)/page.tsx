import { authorize } from "@/lib/auth/authorize";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const { authorized } = await authorize();

  if (!authorized) {
    redirect("/admin/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
}
