import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "./components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { authorize } from "@/lib/auth/authorize";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { authorized } = await authorize();

  if (!authorized) {
    redirect("/admin/login");
  }

  return (
    <SidebarProvider>
      <Sidebar />
      <main className="py-8 px-12 w-full h-svh">{children}</main>
      <SidebarTrigger className="md:hidden fixed top-4 left-4" />
      <Toaster richColors />
    </SidebarProvider>
  );
}
