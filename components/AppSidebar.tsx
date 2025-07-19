"use client";

import type * as React from "react";
import {
  BarChart3,
  Building2,
  CreditCard,
  DollarSign,
  Home,
  PieChart,
  Settings,
  TrendingUp,
  Wallet,
  Target,
  FileText,
  Bell,
  Receipt,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import useLogout from "./hooks/useLogout";

// Navigation items
const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Budgeting",
    url: "/budgeting",
    icon: PieChart,
  },
  {
    title: "Spending",
    url: "/spending",
    icon: Receipt,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Building2,
  },
  {
    title: "Portfolio",
    url: "#",
    icon: TrendingUp,
  },
  {
    title: "Assets",
    url: "#",
    icon: Building2,
  },
  {
    title: "Transactions",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "Budget",
    url: "#",
    icon: Wallet,
  },
  {
    title: "Goals",
    url: "#",
    icon: Target,
  },
];

const analyticsItems = [
  {
    title: "Reports",
    url: "#",
    icon: FileText,
  },
  {
    title: "Analytics",
    url: "#",
    icon: BarChart3,
  },
  {
    title: "Charts",
    url: "#",
    icon: PieChart,
  },
];

const settingsItems = [
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { logout } = useLogout();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 sm:px-4 py-2">
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-sm sm:text-base">
              FinanceTracker
            </span>
            <span className="truncate text-xs text-muted-foreground">
              Asset Management
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-2 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex items-center gap-2">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="User"
                  />
                  <AvatarFallback className="rounded-lg text-xs">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-xs sm:text-sm">
                    John Doe
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    john@example.com
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
