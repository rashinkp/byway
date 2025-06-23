import { ComponentType, SVGProps } from "react";
import {
  BarChart,
  BookOpen,
  FolderTree,
  LayoutDashboard,
  School,
  Settings,
  Users,
  DollarSign,
  User,
  Wallet,
  MessageSquare,
  Bell,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/chat",
    label: "Chat",
    icon: MessageSquare,
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
    href: "/admin/wallet",
    label: "Wallet",
    icon: Wallet,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart,
  },
  {
    href: "/admin/profile",
    label: "Profile",
    icon: User,
  },
];

export const INSTRUCTOR_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/instructor",
    icon: LayoutDashboard,
  },
  {
    label: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    label: "Courses",
    href: "/instructor/courses",
    icon: BookOpen,
  },
  {
    label: "Wallet",
    href: "/instructor/wallet",
    icon: Wallet,
  },
  {
    label: "Analytics",
    href: "/instructor/analytics",
    icon: BarChart,
  },
  {
    label: "Profile",
    href: "/instructor/profile",
    icon: User,
  },
];
