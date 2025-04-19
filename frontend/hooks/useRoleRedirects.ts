// src/hooks/useRoleRedirects.ts
"use client";

import { useRouter } from "next/navigation";

export function useRoleRedirect() {
  const router = useRouter();

  const redirectByRole = (role: string) => {
    const roleRedirects: Record<string, string> = {
      ADMIN: "/admin/dashboard",
      INSTRUCTOR: "/instructor/dashboard",
      USER: "/dashboard",
    };
    const redirectPath = roleRedirects[role] || "/dashboard";
    router.push(redirectPath);
  };

  return { redirectByRole };
}
