import { Toaster } from "@/components/ui/sonner";
import { authorize } from "@/lib/auth/authorize";
import { redirect } from "next/navigation";

export default async function AdminAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { authorized } = await authorize();

  if (authorized) {
    redirect("/admin");
  }

  return (
    <>
      <main className="py-8 px-12 w-full h-svh">{children}</main>
      <Toaster richColors position="top-center" />
    </>
  );
}
