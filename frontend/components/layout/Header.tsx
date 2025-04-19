// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useLogout } from "@/hooks/auth/useLogout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface HeaderProps {
  client?: { id: string; name: string }; // Define expected props (if any)
}

export function Header({ client }: HeaderProps = {}) {
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Byway
        </Link>
        <nav className="flex items-center gap-4">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : user ? (
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
              <Button
                variant="outline"
                onClick={() => logout()}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
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
