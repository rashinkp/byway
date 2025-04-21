import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  BarChart,
  BookOpen,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export const INSTRUCTOR_NAV_ITEMS: NavItem[] = [
  {
    href: "/instructor/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: "/instructor/courses",
    label: "Courses",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    href: "/instructor/students",
    label: "Students",
    icon: <Users className="h-5 w-5" />,
  },
  {
    href: "/instructor/requests",
    label: "Requests",
    icon: <Users className="h-5 w-5" />,
  },
  {
    href: "/instructor/analytics",
    label: "Analytics",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    href: "/instructor/settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function InstructorNavItemLink({
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
