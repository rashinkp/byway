"use client";

import { FC } from "react";
import { User, BookOpen, Wallet, History, ShoppingBag, Settings, BarChart2, LogOut, Award } from "lucide-react";
import { cn } from "@/utils/cn";
import { useLogout } from "@/hooks/auth/useLogout";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isInstructor?: boolean;
}

const Sidebar: FC<SidebarProps> = ({ activeSection, setActiveSection, isInstructor = false }) => {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const router = useRouter();

  const navigationItems = isInstructor
    ? [
        { id: "profile", label: "Profile", icon: User },
        { id: "courses", label: "My Courses", icon: BookOpen },
        { id: "earnings", label: "Earnings", icon: Wallet },
        { id: "analytics", label: "Analytics", icon: BarChart2 },
        { id: "settings", label: "Settings", icon: Settings },
      ]
    : [
        { id: "profile", label: "Profile", icon: User },
        { id: "courses", label: "My Courses", icon: BookOpen },
        { id: "certificates", label: "Certificates", icon: Award },
        { id: "wallet", label: "Wallet", icon: Wallet },
        { id: "transactions", label: "Transactions", icon: History },
        { id: "orders", label: "Orders", icon: ShoppingBag },
      ];

  return (
    <div className="w-64 bg-white/60 backdrop-blur-sm border-r border-gray-200/50 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {isInstructor ? "Instructor Dashboard" : "My Account"}
        </h2>
      </div>
      <nav className="space-y-1 px-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeSection === item.id
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50/50"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="pt-6 mt-6 border-t border-gray-200/50 px-3">
        <button
          onClick={() => {
            logout(undefined, {
              onSuccess: () => {
                router.push("/login");
              },
            });
          }}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50/50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
