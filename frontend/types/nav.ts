import { ComponentType, SVGProps } from "react";
import {
  BarChart,
  BookOpen,
  FolderTree,
  LayoutDashboard,
  School,
  Settings,
  Users,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/students",
    label: "Students",
    icon: Users,
  },
  {
    href: "/admin/instructors",
    label: "Instructors",
    icon: School,
  },
  {
    href: "/admin/courses",
    label: "Courses",
    icon: BookOpen,
  },
  {
    href: "/admin/category",
    label: "Categories",
    icon: FolderTree,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export const INSTRUCTOR_NAV_ITEMS: NavItem[] = [
  {
    href: "/instructor/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/instructor/courses",
    label: "Courses",
    icon: BookOpen,
  },
];
