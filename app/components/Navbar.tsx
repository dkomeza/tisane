"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ModeToggle } from "@/app/components/ModeToggle";
import Signet from "./Signet";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);

  // Scroll Effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entry Animation
  useGSAP(
    () => {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });
    },
    { scope: navRef }
  );

  const navLinks = [
    { name: "O wydarzeniu", href: "#about" },
    { name: "Tematyka", href: "#topics" },
    { name: "Konkurs IT is ME", href: "#contest" },
    { name: "Dla Kogo", href: "#target" },
    { name: "Organizatorzy", href: "#organizers" },
  ];

  return (
    <header
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
        isScrolled
          ? "bg-background/70 backdrop-blur-xl border-border/40 py-3 shadow-sm supports-backdrop-filter:bg-background/60"
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group relative z-50">
          <div className="flex flex-col leading-none">
            <span className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-brand-red transition-colors duration-300 whitespace-nowrap">
              AGH IT
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground group-hover:text-brand-pink transition-colors duration-300 uppercase whitespace-nowrap">
              Future Day
            </span>
          </div>
          <Signet className="text-foreground group-hover:text-brand-red size-8 transition-colors duration-300" />
        </Link>

        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.name}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-transparent focus:bg-transparent data-[active=true]:bg-transparent data-[state=open]:bg-transparent",
                      "text-sm font-sans text-muted-foreground hover:text-brand-red focus:text-brand-red transition-colors",
                      "h-9 px-4 rounded-md"
                    )}
                  >
                    <Link href={link.href}>{link.name}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />

          <Button
            size="sm"
            className={cn(
              "hidden lg:flex font-semibold transition-all duration-300",
              isScrolled
                ? "bg-foreground text-background hover:bg-brand-red hover:text-white"
                : "bg-brand-red text-white hover:bg-brand-pink shadow-lg shadow-brand-red/20"
            )}
          >
            Zarejestruj się
          </Button>

          {/* MOBILE TOGGLE */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground hover:text-brand-red hover:bg-transparent"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full sm:w-[350px] border-l border-border/40 bg-background/70 dark:bg-background/60 backdrop-blur-2xl p-0 [&>button]:top-8 [&>button]:right-8 [&>button>svg]:size-6"
            >
              <div className="flex flex-col h-full p-6">
                <SheetHeader className="text-left border-b border-border/50 pb-6 mb-8">
                  <SheetTitle className="flex flex-col leading-none">
                    <span className="text-2xl font-extrabold tracking-tight text-foreground">
                      AGH IT
                    </span>
                    <span className="text-xs font-mono tracking-widest text-brand-pink uppercase mt-1">
                      Future Day
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-2">
                  <ul>
                    {navLinks.map((link, i) => (
                      <SheetClose asChild key={link.name}>
                        <li className="text-xl font-medium text-muted-foreground hover:text-foreground hover:pl-2 transition-all duration-300 py-3 border-b border-border/30 last:border-0 group">
                          <Link
                            href={link.href}
                            className="flex items-center justify-between group"
                            style={{ transitionDelay: `${i * 50}ms` }}
                          >
                            {link.name}
                            <span className="text-brand-red opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                              →
                            </span>
                          </Link>
                        </li>
                      </SheetClose>
                    ))}
                  </ul>
                </nav>

                <div className="mt-auto pt-8">
                  <Button
                    className="w-full bg-brand-red hover:bg-brand-pink text-white font-bold h-12 text-lg shadow-lg shadow-brand-red/20"
                    size="lg"
                  >
                    Zarejestruj się
                  </Button>

                  <div className="mt-6 flex justify-between text-xs font-mono text-muted-foreground opacity-50">
                    <span>v2026.1.0</span>
                    <span>AGH UST</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
