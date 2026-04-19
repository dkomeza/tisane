"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BlockProps } from "@/components/registry";
import { cn } from "@/lib/utils";
import { iconMap, IconName } from "@/components/registry/items/icon";
import { getMedia } from "@/app/actions/media/view-action";
import { ButtonProps } from "./index";

interface ButtonClientProps extends BlockProps<ButtonProps> {
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function ButtonClient({
  data,
  onClick,
  className,
  type = "button",
}: ButtonClientProps) {
  const colorStyles = {
    primary:
      "bg-brand-purple-300 text-brand-grey-100 hover:bg-brand-purple-400 focus:bg-brand-purple-300 pressed:bg-brand-purple-400 disabled:bg-brand-gray-400 disabled:text-brand-gray-200",
    dark: "bg-brand-pink-400 text-brand-grey-100 hover:bg-brand-pink-500 focus:bg-brand-pink-400 pressed:bg-brand-pink-500 disabled:bg-brand-gray-200 disabled:text-brand-gray-400",
    white:
      "bg-transparent text-brand-grey-100 border border-b border-brand-gray-100 hover:border-b-2 focus:border-2 pressed:border-none pressed:bg-brand-gray-100 pressed:text-brand-grey-100 disabled:text-brand-gray-300 disabled:border-none",
    violet:
      "bg-transparent text-brand-purple-200 border border-brand-purple-200 hover:text-brand-purple-400 hover:border-brand-purple-400 focus:border-2 focus:border-brand-purple-400 focus:text-brand-purple-200 pressed:bg-brand-purple-400 pressed:border-none pressed:text-brand-grey-100 disabled:text-brand-gray-400 disabled:border-brand-gray-400",
    pink: "text-brand-pink-300 border border-brand-pink-300 hover:text-brand-pink-500 hover:border-brand-pink-500 focus:border-2 focus:border-brand-pink-500 focus:text-brand-pink-300 pressed:bg-brand-pink-400 pressed:border-none pressed:text-brand-grey-100 disabled:text-brand-gray-300 disabled:border-brand-gray-300",
  };

  const sizeStyles = {
    small: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-lg",
  };

  const IconLeft = data.iconLeft ? iconMap[data.iconLeft as IconName] : null;
  const IconRight = data.iconRight ? iconMap[data.iconRight as IconName] : null;

  const baseClass = cn(
    "flex items-center justify-center gap-3 font-medium transition-colors duration-200 disabled:pointer-events-none",
    colorStyles[data.color],
    sizeStyles[data.variant],
    className,
  );

  const inner = (
    <>
      {IconLeft && <IconLeft className="size-5" />}
      <span className="flex-1 text-center">{data.content}</span>
      {IconRight && <IconRight className="size-5" />}
    </>
  );

  const action = data.action ?? { type: "none" };

  if (action.type === "link") {
    const href = action.url?.replace("/home", "/") || "#";
    if (action.linkType === "internal") {
      return (
        <Link
          href={href}
          target={action.newTab ? "_blank" : undefined}
          rel={action.newTab ? "noopener noreferrer" : undefined}
          className={baseClass}
        >
          {inner}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target={action.newTab ? "_blank" : undefined}
        rel={action.newTab ? "noopener noreferrer" : undefined}
        className={baseClass}
      >
        {inner}
      </a>
    );
  }

  if (action.type === "download") {
    return (
      <DownloadButton
        data={data}
        className={baseClass}
        inner={inner}
        mediaId={action.mediaId}
      />
    );
  }

  if (action.type === "scroll") {
    const handleScroll = () => {
      const target = document.querySelector(
        `[data-tisane-id="${action.targetId}"]`,
      );
      console.log(target, action.targetId);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return (
      <button
        type={type}
        onClick={onClick ?? handleScroll}
        className={baseClass}
      >
        {inner}
      </button>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClass}>
      {inner}
    </button>
  );
}

interface DownloadButtonProps {
  data: ButtonProps;
  mediaId: string;
  className: string;
  inner: React.ReactNode;
}

function DownloadButton({ mediaId, className, inner }: DownloadButtonProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUrl(null);
      return;
    }
    let mounted = true;
    getMedia(mediaId).then((m) => {
      if (mounted) setUrl(m?.url ?? null);
    });
    return () => {
      mounted = false;
    };
  }, [mediaId]);

  return (
    <a
      href={url ?? undefined}
      download
      target="_blank"
      className={cn(className, !url && "opacity-50 pointer-events-none")}
    >
      {inner}
    </a>
  );
}
