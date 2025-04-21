"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLogout } from "@/hooks/auth/useLogout";
import { useCreateInstructor } from "@/hooks/instructor/useCreateInstructor";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import {
  InstructorFormData,
  InstructorFormModal,
} from "@/components/instructor/InstructorAdd";

interface HeaderProps {
  client?: { id: string; name: string };
}

export function Header({ client }: HeaderProps = {}) {
  const { user, isLoading } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: createInstructor, isPending: isCreatingInstructor } =
    useCreateInstructor();
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);

  const handleInstructorSubmit = useCallback(
    async (data: InstructorFormData): Promise<void> => {
      return new Promise((resolve) => {
        createInstructor(data, {
          onSuccess: () => {
            setIsInstructorModalOpen(false);
            resolve();
          },
          onError: () => {
            resolve();
          },
        });
      });
    },
    [createInstructor, setIsInstructorModalOpen]
  );

  return (
    <>
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
                  <Link href="/">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                )}
                {user.role !== "INSTRUCTOR" && (
                  <Button
                    variant="outline"
                    onClick={() => setIsInstructorModalOpen(true)}
                    disabled={isLoggingOut || isCreatingInstructor}
                  >
                    {isCreatingInstructor ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      "Tech in Byway"
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => logout()}
                  disabled={isLoggingOut || isCreatingInstructor}
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

      <InstructorFormModal
        open={isInstructorModalOpen}
        onOpenChange={setIsInstructorModalOpen}
        onSubmit={handleInstructorSubmit}
        isSubmitting={isCreatingInstructor}
      />
    </>
  );
}
