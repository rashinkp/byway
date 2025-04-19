"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VerifyOtpForm } from "@/components/auth/OtpForm";
import { useAuth } from "@/hooks/auth/useAuth";
import { ROUTES } from "@/constants/routes";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, user } = useAuth();
  const email = searchParams.get("email");

 useEffect(() => {
     if (!isLoading && isAuthenticated && user) {
       const route = ROUTES[user.role as keyof typeof ROUTES] || ROUTES.DEFAULT;
       router.push(route);
     }
   }, [isAuthenticated, isLoading, user, router]);

  if (user || !email) {
    return null;
  }

  
  return (
    <div className="">
      <VerifyOtpForm />
      
    </div>
  );
}
