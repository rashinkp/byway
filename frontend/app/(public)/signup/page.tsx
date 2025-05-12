"use client";

import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuth } from "@/hooks/auth/useAuth";
import { useEffect } from "react";
import { ROUTES } from "@/constants/routes";

export default function SignupPage() {

  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
      if (!isLoading && isAuthenticated && user) {
        const route = ROUTES[user.role as keyof typeof ROUTES] || ROUTES.DEFAULT;
        router.push(route);
      }
  }, [isAuthenticated, isLoading, user, router]);
  

  if (isLoading) {
    return <p>Loading.......</p>;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
      <SignupForm />
  );
}
