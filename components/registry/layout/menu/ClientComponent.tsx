"use client";

import {
  BlockProps,
  COMPONENT_REGISTRY,
  ReactClientComponent,
} from "@/components/registry";
import { nanoid } from "nanoid";
import { MenuProps } from ".";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * This is the client-side component that will be rendered in the application.
 */
export function MenuClient({ data }: BlockProps<MenuProps>) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 64);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="hidden md:block">
        <div
          className={cn(
            "flex justify-between items-center px-32 transition-all duration-500",
            isScrolled ? "py-4" : "py-8",
            isScrolled
              ? "backdrop-blur-2xl bg-black/10"
              : "backdrop-blur-none bg-transparent",
            isScrolled ? "shadow-md" : "shadow-none",
            isScrolled ? "border-b border-white/10" : "border-none",
          )}
        >
          <ul className="flex items-center gap-4">
            {data.left.map((component, index) => {
              const Component = COMPONENT_REGISTRY[component.type]
                .ClientComponent as ReactClientComponent<typeof component.data>;
              return (
                <li key={index} className="h-12 flex">
                  <Component id={nanoid()} data={component.data} />
                </li>
              );
            })}
          </ul>
          <ul className="flex items-center gap-4">
            {data.center.map((component, index) => {
              const Component = COMPONENT_REGISTRY[component.type]
                .ClientComponent as ReactClientComponent<typeof component.data>;
              return (
                <Component key={index} id={nanoid()} data={component.data} />
              );
            })}
          </ul>
          <ul className="flex items-center gap-4">
            {data.right.map((component, index) => {
              const Component = COMPONENT_REGISTRY[component.type]
                .ClientComponent as ReactClientComponent<typeof component.data>;
              return (
                <Component key={index} id={nanoid()} data={component.data} />
              );
            })}
          </ul>
        </div>
      </div>
      <div className="md:hidden flex justify-end items-center px-4 py-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/10 backdrop-blur-md border border-white/10"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full bg-brand-grey-600/20 backdrop-blur-2xl">
            <SheetTitle className="sr-only">Menu</SheetTitle>

            <ul className="flex flex-col justify-between items-stretch px-4 gap-4 h-full">
              <div>
                {data.m_top.map((component, index) => {
                  const Component = COMPONENT_REGISTRY[component.type]
                    .ClientComponent as ReactClientComponent<
                    typeof component.data
                  >;
                  return (
                    <li key={index} className="h-12 flex">
                      <Component id={nanoid()} data={component.data} />
                    </li>
                  );
                })}
              </div>
              <div>
                {data.m_center.map((component, index) => {
                  const Component = COMPONENT_REGISTRY[component.type]
                    .ClientComponent as ReactClientComponent<
                    typeof component.data
                  >;
                  return (
                    <li key={index} className="h-12 flex">
                      <Component id={nanoid()} data={component.data} />
                    </li>
                  );
                })}
              </div>
              <div>
                {data.m_bottom.map((component, index) => {
                  const Component = COMPONENT_REGISTRY[component.type]
                    .ClientComponent as ReactClientComponent<
                    typeof component.data
                  >;
                  return (
                    <li key={index} className="h-12 flex">
                      <Component id={nanoid()} data={component.data} />
                    </li>
                  );
                })}
              </div>
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
