"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Byway
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href="/admin/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              {user.role === "INSTRUCTOR" && (
                <Link href="/instructor/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              {user.role === "USER" && (
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
