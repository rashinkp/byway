import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { BarChart, BookOpen, FolderTree, LayoutDashboard, Link as LinkIcon, School, Settings, Users } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";


interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}


export const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: "/admin/students",
    label: "Students",
    icon: <Users className="h-5 w-5" />,
  },
  {
    href: "/admin/instructors",
    label: "Instructors",
    icon: <School className="h-5 w-5" />,
  },
  {
    href: "/admin/courses",
    label: "Courses",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    href: "/admin/category",
    label: "Categories",
    icon: <FolderTree className="h-5 w-5" />,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
  },
];


export function NavItemLink({
  item,
  collapsed,
  isActive,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={item.href} onClick={onClick}>
          <Button
            variant="ghost"
            className={`w-full ${
              collapsed ? "justify-center" : "justify-start"
            } 
              ${
                isActive
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              } 
              transition-colors`}
          >
            {item.icon}
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </Button>
        </Link>
      </TooltipTrigger>
      {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
    </Tooltip>
  );
}