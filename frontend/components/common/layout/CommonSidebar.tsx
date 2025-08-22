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
  // Determine sidebar width and visibility
  const getSidebarClasses = () => {
    // Mobile behavior
    if (mobileMenuOpen) {
      return "translate-x-0 w-64"; // Full width when mobile menu is open (overlay)
    }
    
    if (collapsed) {
      // On mobile: collapsed sidebar should not overlap content
      return "translate-x-0 w-20 lg:relative"; // Fixed width, relative on desktop
    }
    
    // Desktop behavior
    if (isCollapsible) {
      return "lg:translate-x-0 w-64"; // Full width on desktop
    } else {
      return "lg:translate-x-0 w-64 lg:w-[80px] xl:w-64"; // Responsive width
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-[#18181b] shadow-xl transition-all duration-300 ease-in-out
        ${getSidebarClasses()}
        lg:relative lg:z-40`}
    >
      <div className="flex flex-col h-full">
        <SidebarHeader
          collapsed={collapsed && !mobileMenuOpen}
          toggleCollapse={toggleCollapse}
          title={headerTitle}
          subtitle={headerSubtitle}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="flex-1 px-3 lg:px-4 py-4 lg:py-6 overflow-y-auto">
          <TooltipProvider delayDuration={0}>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isDashboard =
                  item.href === "/admin" || item.href === "/instructor";
                const isActive = isDashboard
                  ? pathname === item.href || pathname === item.href + "/"
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                return (
                  <NavItemLink
                    key={item.href}
                    item={item}
                    collapsed={collapsed && !mobileMenuOpen} // Show text when mobile menu is expanded
                    isActive={isActive}
                    onClick={() => setMobileMenuOpen(false)}
                  />
                );
              })}
            </nav>
          </TooltipProvider>
        </div>

        <div
          className={`px-3 lg:px-5 pb-2 flex ${
            (collapsed && !mobileMenuOpen) ? "justify-center" : "justify-start"
          } w-full`}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onNotificationClick}
                  className={`flex items-center gap-2 rounded-lg px-2 lg:px-3 py-2 transition-colors duration-200 hover:bg-[#facc15]/10 text-[#facc15] hover:text-[#facc15] w-full ${
                    (collapsed && !mobileMenuOpen) ? "justify-center" : ""
                  }`}
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {!(collapsed && !mobileMenuOpen) && <span className="text-sm">Notifications</span>}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-white text-[#18181b] border-[#facc15] px-3 py-1.5 rounded-lg"
              >
                Notifications
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div
          className={`p-3 lg:p-5 border-t border-gray-800 ${
            (collapsed && !mobileMenuOpen)
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
                  className="text-red-400 hover:bg-[#facc15]/10 hover:text-red-500 w-full lg:w-auto transition-colors duration-200 rounded-lg flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  {!(collapsed && !mobileMenuOpen) && (
                    <span className="ml-2 hidden xl:inline font-medium">
                      Logout
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className={`bg-white text-[#18181b] border-[#facc15] px-3 py-1.5 rounded-lg ${
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
