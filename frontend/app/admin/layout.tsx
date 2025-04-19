"use client";
import { ReactNode, useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Users,
  BookOpen,
  School,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Settings,
  BarChart,
  FolderTree,
  Bell,
  User,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if screen is small on initial mount
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleLogout = async () => {
    // try {
    //   await logout();
    //   router.push("/login");
    // } catch (error) {
    //   console.error("Logout failed:", error);
    // }
  };

  const navItems: NavItem[] = [
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

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "AD";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out 
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
          ${collapsed ? "w-20" : "w-64"}`}
      >
        <div
          className={`p-4 border-b flex ${
            collapsed ? "justify-center" : "justify-between"
          } items-center`}
        >
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs text-gray-500">Management Console</p>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-600 text-white">
                  ED
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="px-3 py-4">
          <TooltipProvider delayDuration={0}>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
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
                          {!collapsed && (
                            <span className="ml-3">{item.label}</span>
                          )}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
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

      {/* Content Area */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out
        ${collapsed ? "lg:ml-20" : "lg:ml-64"} pt-16 lg:pt-0`}
      >
        {/* Top navbar */}
        <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {navItems.find((item) => item.href === pathname)?.label ||
                  "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
