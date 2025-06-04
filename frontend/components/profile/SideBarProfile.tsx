"use client";

import { cn } from "@/utils/cn";
import {
  User,
  BookOpen,
  Wallet,
  Receipt,
  ShoppingBag,
  Award,
  Settings,
  LogOut,
} from "lucide-react";
import { useLogout } from "@/hooks/auth/useLogout";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-50",
  },
  {
    id: "courses",
    label: "My Courses",
    icon: BookOpen,
    color: "text-green-600",
    bgColor: "bg-green-50",
    hoverColor: "hover:bg-green-50",
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: Wallet,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-50",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: Receipt,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    hoverColor: "hover:bg-orange-50",
  },
  {
    id: "orders",
    label: "My Orders",
    icon: ShoppingBag,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    hoverColor: "hover:bg-pink-50",
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: Award,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    hoverColor: "hover:bg-yellow-50",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    hoverColor: "hover:bg-gray-50",
  },
];

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const router = useRouter();

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">My Account</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? `${item.bgColor} ${item.color} font-medium`
                  : "text-gray-600 hover:text-gray-900",
                item.hoverColor
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? item.color : "text-gray-400")} />
              <span className="text-sm">{item.label}</span>
              {isActive && (
                <div className={cn("w-1 h-6 rounded-full ml-auto", item.bgColor)} />
              )}
            </button>
          );
        })}
      </nav>

      <div className="pt-6 mt-6 border-t border-gray-200">
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </div>
  );
}
