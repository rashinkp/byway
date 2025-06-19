"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { NavItemLink } from "@/components/common/layout/NavItemLink";
import { Button } from "@/components/ui/button";
import { LogOut, Bell } from "lucide-react";
import { NavItem } from "@/types/nav";
import { SidebarHeader } from "./SideBarHeader";

interface CommonSidebarProps {
  collapsed: boolean;
  toggleCollapse?: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  pathname: string;
  handleLogout: () => void;
  headerTitle: string;
  headerSubtitle: string;
  navItems: NavItem[];
  isCollapsible: boolean;
  onNotificationClick?: () => void;
}

export function CommonSidebar({
  collapsed,
  toggleCollapse,
  mobileMenuOpen,
  setMobileMenuOpen,
  pathname,
  handleLogout,
  headerTitle,
  headerSubtitle,
  navItems,
  isCollapsible,
  onNotificationClick,
}: CommonSidebarProps) {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-black text-white shadow-xl transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 ${
          isCollapsible
            ? collapsed
              ? "w-20"
              : "w-64"
            : "w-64 lg:w-[80px] xl:w-64"
        }`}
    >
      <div className="flex flex-col h-full">
        <SidebarHeader
          collapsed={collapsed}
          toggleCollapse={toggleCollapse}
          title={headerTitle}
          subtitle={headerSubtitle}
        />

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <TooltipProvider delayDuration={0}>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItemLink
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  isActive={pathname === item.href}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>
          </TooltipProvider>
        </div>

        <div className={`px-5 pb-2 flex ${collapsed ? 'justify-center' : 'justify-start'} w-full`}> 
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onNotificationClick}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-zinc-800 text-yellow-400 hover:text-yellow-300 w-full ${collapsed ? 'justify-center' : ''}`}
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {!collapsed && <span className="text-sm">Notifications</span>}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-zinc-800 text-white border-zinc-700 px-3 py-1.5 rounded-lg"
              >
                Notifications
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div
          className={`p-5 border-t border-zinc-800 ${
            collapsed
              ? "flex justify-center"
              : "flex justify-center lg:justify-start"
          }`}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:bg-zinc-800 hover:text-red-300 w-full lg:w-auto transition-colors duration-200 rounded-lg flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  {!collapsed && (
                    <span className="ml-2 hidden xl:inline font-medium">
                      Logout
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className={`bg-zinc-800 text-white border-zinc-700 px-3 py-1.5 rounded-lg ${
                  isCollapsible ? "" : "lg:block xl:hidden"
                }`}
              >
                Logout
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
}
