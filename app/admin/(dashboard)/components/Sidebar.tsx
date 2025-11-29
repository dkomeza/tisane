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
  type LucideIcon,
} from "lucide-react";

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
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "General", href: "/admin/settings/general", icon: Settings2 },
      { label: "Users", href: "/admin/settings/users", icon: UserCircle2 },
      {
        label: "Integrations",
        href: "/admin/settings/integrations",
        icon: Blocks,
      },
    ],
  },
];

function Sidebar() {
  return (
    <ShadSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarHoverTrigger />
        <SidebarTrigger />
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
      <SidebarFooter></SidebarFooter>
    </ShadSidebar>
  );
}

export default Sidebar;
