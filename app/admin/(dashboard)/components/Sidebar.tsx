"use client";

import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarHoverTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";

import {
  Blocks,
  FileText,
  Image,
  LayoutDashboard,
  Menu,
  Palette,
  Rss,
  Settings2,
  UserCircle2,
  Box,
  type LucideIcon,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "better-auth";
import { useMediaQuery } from "@/hooks/use-media-query";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

type Group = {
  label: string;
  items: { label: string; href: string; icon: LucideIcon }[];
};

const groups: Group[] = [
  {
    label: "Content",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Pages", href: "/admin/pages", icon: FileText },
      { label: "Posts", href: "/admin/posts", icon: Rss },
      { label: "Media", href: "/admin/media", icon: Image },
    ],
  },
  {
    label: "Design",
    items: [
      { label: "Menus", href: "/admin/menus", icon: Menu },
      { label: "Appearance", href: "/admin/appearance", icon: Palette },
      { label: "Components", href: "/admin/components", icon: Box },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "General", href: "/admin/settings", icon: Settings2 },
      { label: "Users", href: "/admin/users", icon: UserCircle2 },
      {
        label: "Integrations",
        href: "/admin/integrations",
        icon: Blocks,
      },
    ],
  },
];

function Sidebar({ user }: { user: User }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  return (
    <ShadSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarHoverTrigger className="hidden md:block" />
        <SidebarTrigger className="hidden md:block" />
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuButton key={item.href} asChild>
                    <Link href={item.href}>
                      <item.icon />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await signOut();
                router.push("/admin/login");
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </ShadSidebar>
  );
}

export default Sidebar;
