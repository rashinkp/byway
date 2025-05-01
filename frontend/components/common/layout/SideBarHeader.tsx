import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleCollapse?: () => void;
  title: string;
  subtitle: string;
}

export function SidebarHeader({
  collapsed,
  toggleCollapse,
  title,
  subtitle,
}: {
  collapsed: boolean;
  toggleCollapse?: () => void;
  title: string;
  subtitle: string;
}) {
  const initials = title.substring(0, 2).toUpperCase();

  return (
    <div
      className={`p-6 border-b border-zinc-800 flex ${
        collapsed ? "justify-center" : "justify-between"
      } items-center`}
    >
      {!collapsed && (
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>
        </div>
      )}
      
      {toggleCollapse && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="hidden lg:flex text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      )}
    </div>
  );
}
