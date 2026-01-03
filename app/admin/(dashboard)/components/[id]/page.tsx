import { COMPONENT_REGISTRY } from "@/components/registry";
import { notFound } from "next/navigation";
import { ComponentPreviewWrapper } from "./preview-wrapper";

export function generateStaticParams() {
  return Object.keys(COMPONENT_REGISTRY).map((id) => ({ id }));
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const key = id as keyof typeof COMPONENT_REGISTRY;

  if (!COMPONENT_REGISTRY[key]) {
    notFound();
  }

  return <ComponentPreviewWrapper componentType={key} />;
}
