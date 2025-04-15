"use client";
import { ReactNode } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Users, BookOpen, School, LayoutDashboard } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed w-64 bg-white shadow-lg h-screen flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">{user?.email || "Admin"}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              All
            </Button>
          </Link>
          <Link href="/admin/students">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              <Users className="mr-2 h-5 w-5" />
              Students
            </Button>
          </Link>
          <Link href="/admin/instructors">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              <School className="mr-2 h-5 w-5" />
              Instructors
            </Button>
          </Link>
          <Link href="/admin/courses">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Courses
            </Button>
          </Link>
          <Link href="/admin/category">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Category
            </Button>
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
