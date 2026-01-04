
import { authorize } from "@/lib/auth/authorize";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import Preview from "./Preview";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}



export default async function PreviewPage({ params }: PageProps) {
  const { session } = await authorize();
  const { slug = [] } = await params;

  if (!hasPermission(session, "content.read")) {
    redirect("/");
  }

  const parsedSlug = slug
    .filter((part) => part && part.trim() !== "")
    .join("/");

  return <Preview slug={parsedSlug} />;
}
