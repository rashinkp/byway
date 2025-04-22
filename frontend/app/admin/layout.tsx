"use client";

import { Sidebar } from "@/components/admin/Sidebar/SideBar";
import { TopNavbar } from "@/components/admin/TopNavbar/TopNavbar";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";
import { useAuthStore } from "@/stores/auth.store";
import { SkeletonLayout } from "@/components/admin/SkeletonLayout";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading, isInitialized, initializeAuth } = useAuthStore();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize auth if not already done
    if (!isInitialized) {
      initializeAuth();
    }

    // Handle responsive sidebar collapse
    const checkScreenSize = () => {
      setCollapsed(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isInitialized, initializeAuth]);

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
    : "AD";

  // Show skeleton while auth is loading or not initialized
  if (isLoading || !isInitialized) {
    return <SkeletonLayout />;
  }

  // Redirect to login if user is not authenticated or not an admin
  if (!user || user.role !== "ADMIN") {
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
      <Sidebar
        collapsed={collapsed}
        toggleCollapse={() => setCollapsed(!collapsed)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        pathname={pathname}
        handleLogout={handleLogout}
      />
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        } pt-16 lg:pt-0`}
      >
        <TopNavbar
          pathname={pathname}
        />
        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}