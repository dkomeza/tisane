/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Smartphone,
  Tablet,
  Monitor,
  Maximize,
  Tv,
  Scaling,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ContentPreviewProps {
  slug?: string;
  className?: string;
}

const DEVICES = [
  {
    name: "Mobile",
    icon: Smartphone,
    width: 375,
    height: 667,
    label: "375px",
  },
  {
    name: "Tablet",
    icon: Tablet,
    width: 768,
    height: 1024,
    label: "768px",
  },
  {
    name: "Desktop",
    icon: Monitor,
    width: 1440,
    height: 900,
    label: "1440px",
  },
  {
    name: "4K",
    icon: Tv,
    width: 3840,
    height: 2160,
    label: "4K",
  },
  {
    name: "Full Width",
    icon: Maximize,
    width: "100%",
    height: "100%",
    label: "100%",
  },
] as const;

export function ContentPreview({ slug, className }: ContentPreviewProps) {
  const url = slug ? `/preview/${slug}` : "/preview";
  const [size, setSize] = useState<{
    width: number | "100%";
    height: number | "100%";
  }>({
    width: "100%",
    height: "100%",
  });

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  function recomputeSize() {
    const { width, height } = size;

    if (!containerRef.current) {
      setScale(1);
      return;
    }

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const style = getComputedStyle(containerRef.current);
    const paddingX =
      parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const paddingY =
      parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

    const adjustedContainerWidth = containerWidth - paddingX;
    const adjustedContainerHeight = containerHeight - paddingY;

    const targetWidth =
      typeof width === "number" ? width : adjustedContainerWidth;
    const targetHeight =
      typeof height === "number" ? height : adjustedContainerHeight;

    if (targetWidth > containerWidth || targetHeight > containerHeight) {
      const widthScale = adjustedContainerWidth / targetWidth;
      const heightScale = adjustedContainerHeight / targetHeight;

      const newScale = Math.min(widthScale, heightScale);

      setScale(Math.min(newScale, 1));
    } else {
      setScale(1);
    }

    setWidth(targetWidth);
    setHeight(targetHeight);
  }

  // Auto-scale logic
  useEffect(() => {
    recomputeSize();
  }, [size]);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      recomputeSize();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    // resizeObserver.observe(containerRef.current);

    window.addEventListener("resize", handleResize);
    // recomputeSize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={cn("flex flex-col h-full w-full gap-4 flex-1", className)}>
      <Card className="p-2 flex items-center justify-between bg-muted/40 w-full">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {DEVICES.map((device) => (
              <Tooltip key={device.name}>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      size.width === device.width ? "secondary" : "ghost"
                    }
                    size="sm"
                    onClick={() => {
                      setSize({ width: device.width, height: device.height });
                    }}
                    className="h-8 w-8 p-0"
                    type="button"
                  >
                    <device.icon className="h-4 w-4" />
                    <span className="sr-only">{device.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {device.name} - {device.label}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>

          <Separator orientation="vertical" className="h-6 mx-2" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(url, "_blank")}
                  className="h-8 w-8 p-0"
                  type="button"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Open in new tab</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open in new tab</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {scale !== 1 && (
            <div className="text-xs text-muted-foreground ml-2 animate-in fade-in">
              {Math.round(scale * 100)}%
            </div>
          )}
        </div>
      </Card>

      <div
        ref={containerRef}
        className="flex-1 bg-muted/20 rounded-lg border border-border/50 overflow-hidden relative flex items-center justify-center p-6 transition-colors duration-200 w-full"
      >
        <div
          className={cn(
            "relative bg-background shadow-2xl transition-all duration-300 ease-in-out origin-center border border-border",
            size.width === "100%" ? "rounded-md" : "rounded-4xl border-2"
          )}
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <iframe
            className={cn(
              "w-full h-full bg-white transition-all duration-300 ease-in-out border-0",
              size.width === "100%" ? "rounded-md" : "rounded-3xl"
            )}
            style={{
              width: width,
              height: height,
            }}
            src={url}
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
