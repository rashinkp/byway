import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { SidebarHeader } from "./SideBarHeader";
import { NAV_ITEMS, NavItemLink } from "./NavItemLink";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Sidebar({
  collapsed,
  toggleCollapse,
  mobileMenuOpen,
  setMobileMenuOpen,
  pathname,
  handleLogout,
}: {
  collapsed: boolean;
  toggleCollapse: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  pathname: string;
  handleLogout: () => void;
}) {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out 
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 ${collapsed ? "w-20" : "w-64"}`}
    >
      <SidebarHeader collapsed={collapsed} toggleCollapse={toggleCollapse} />
      <div className="px-3 py-4">
        <TooltipProvider delayDuration={0}>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
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
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        {collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        )}
      </div>
    </aside>
  );
}
