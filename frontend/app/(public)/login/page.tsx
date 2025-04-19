// src/components/auth/LoginPage.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/auth/useAuth";
import { ROUTES } from "@/constants/routes";

const LoginForm = dynamic(
  () => import("@/components/auth/LoginForm").then((mod) => mod.LoginForm),
  {
    ssr: false,
  }
);

export default function LoginPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const route = ROUTES[user.role as keyof typeof ROUTES] || ROUTES.DEFAULT;
      router.push(route);
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isAuthenticated) {
    return null;
  }

  return <LoginForm />;
}
