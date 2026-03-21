"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { BlockProps } from "@/components/registry";
import { CmsLinkProps } from ".";
import { usePathname } from "next/navigation";

/**
 * This is the client-side component that will be rendered in the application.
 */
export function CmsLinkClient({ data }: BlockProps<CmsLinkProps>) {
  const href = data.url?.replace("/home", "/") || "#";
  const target = data.newTab ? "_blank" : undefined;
  const rel = data.newTab ? "noopener noreferrer" : undefined;

  const path = usePathname();
  const isActive = path === href;

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(
        "flex flex-col gap-1 group/cms-link hover:text-brand-purple-300 @md:hover:text-brand-purple-200 transition-colors",
        isActive && "text-brand-purple-300 @md:text-brand-purple-200",
      )}
    >
      <span className="text-3xl @md:text-lg font-light px-6 @md:px-0">
        {data.text}
      </span>
      <span
        className={cn(
          "w-full @md:w-0 h-0.5 group-hover/cms-link:w-full transition-all",
          isActive
            ? "@md:w-full bg-brand-purple-300 @md:bg-brand-purple-200"
            : "bg-brand-grey-100 group-hover/cms-link:bg-brand-purple-300 @md:group-hover/cms-link:bg-brand-purple-200",
        )}
      ></span>
    </Link>
  );
}
