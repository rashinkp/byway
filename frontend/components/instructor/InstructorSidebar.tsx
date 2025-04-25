"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { SidebarHeader } from "@/components/instructor/InstructorSidebarHeader";
import {
  InstructorNavItemLink,
  INSTRUCTOR_NAV_ITEMS,
} from "@/components/instructor/InstructorNavItemLink";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function InstructorSidebar({
  mobileMenuOpen,
  setMobileMenuOpen,
  pathname,
  handleLogout,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  pathname: string;
  handleLogout: () => void;
}) {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out 
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 w-64 lg:w-[80px] xl:w-64`}
    >
      <SidebarHeader />
      <div className="px-3 py-4">
        <TooltipProvider delayDuration={0}>
          <nav className="space-y-1">
            {INSTRUCTOR_NAV_ITEMS.map((item) => (
              <InstructorNavItemLink
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
          </nav>
        </TooltipProvider>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t flex justify-center lg:justify-start">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:bg-red-50 hover:text-red-700 w-full lg:w-auto"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2 hidden xl:inline">Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="lg:block xl:hidden">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}