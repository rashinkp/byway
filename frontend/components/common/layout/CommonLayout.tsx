"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";
import { useAuthStore } from "@/stores/auth.store";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { CommonSidebar } from "@/components/common/layout/CommonSidebar";
import { TopNavbar } from "@/components/common/layout/TopNavbar";
import { NavItem } from "@/types/nav";

interface CommonLayoutProps {
  children: ReactNode;
  sidebarHeaderTitle: string;
  sidebarHeaderSubtitle: string;
  navItems: NavItem[];
  role: "ADMIN" | "INSTRUCTOR";
  isCollapsible?: boolean;
  skeleton?: ReactNode;
}

export default function CommonLayout({
  children,
  sidebarHeaderTitle,
  sidebarHeaderSubtitle,
  navItems,
  role,
  isCollapsible = false,
  skeleton,
}: CommonLayoutProps) {
  const { user, isLoading, isInitialized, initializeAuth } = useAuthStore();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(isCollapsible);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
    if (isCollapsible) {
      const checkScreenSize = () => {
        setCollapsed(window.innerWidth < 1024);
      };
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }
  }, [isInitialized, initializeAuth, isCollapsible]);

  const handleLogout = async () => {
    try {
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : role === "ADMIN"
    ? "AD"
    : "IN";

  if (isLoading || !isInitialized) {
    return skeleton || null;
  }

  if (!user || user.role !== role) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
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
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <CommonSidebar
        collapsed={collapsed}
        toggleCollapse={
          isCollapsible ? () => setCollapsed(!collapsed) : undefined
        }
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        pathname={pathname}
        handleLogout={handleLogout}
        headerTitle={sidebarHeaderTitle}
        headerSubtitle={sidebarHeaderSubtitle}
        navItems={navItems}
        isCollapsible={isCollapsible}
      />
      <main
        className={`flex-1 transition-all duration-300 ease-in-out pt-16 lg:pt-0 ${
          isCollapsible
            ? collapsed
              ? "lg:ml-20"
              : "lg:ml-64"
            : "lg:ml-64 lg:[&  @media(min-width:1024px)]:ml-[80px] xl:ml-64"
        }`}
      >
        <TopNavbar pathname={pathname} navItems={navItems} />
        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
