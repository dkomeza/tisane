import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "./components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="py-8 px-12 w-full h-svh">{children}</main>
      <SidebarTrigger className="md:hidden fixed top-4 left-4" />
      <Toaster richColors />
    </SidebarProvider>
  );
}
