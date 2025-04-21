"use client";

import { InstructorSidebar } from "@/components/instructor/InstructorSidebar";
import { TopNavbar } from "@/components/admin/TopNavbar/TopNavbar"; // Reuse admin TopNavbar
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";
import { useAuthStore } from "@/stores/auth.store";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface InstructorLayoutProps {
  children: ReactNode;
}

export default function InstructorLayout({ children }: InstructorLayoutProps) {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkScreenSize = () => {
      setCollapsed(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
    : "IN";

  if (!isMounted) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    );
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
      <InstructorSidebar
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
          userInitials={userInitials}
          handleLogout={handleLogout}
        />
        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
