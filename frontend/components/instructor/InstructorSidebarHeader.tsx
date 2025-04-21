import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SidebarHeader({
  collapsed,
  toggleCollapse,
}: {
  collapsed: boolean;
  toggleCollapse: () => void;
}) {
  return (
    <div
      className={`p-4 border-b flex ${
        collapsed ? "justify-center" : "justify-between"
      } items-center`}
    >
      {!collapsed && (
        <div>
          <h1 className="text-xl font-bold text-gray-800">Instructor Panel</h1>
          <p className="text-xs text-gray-500">Teaching Console</p>
        </div>
      )}
      {collapsed && (
        <div className="flex justify-center">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-600 text-white">
              IN
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCollapse}
        className="hidden lg:flex"
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
