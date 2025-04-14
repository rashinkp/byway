"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { VerifyOtpForm } from "@/components/auth/OtpForm";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setEmail } = useAuthStore();
  const email = searchParams.get("email");

  useEffect(() => {
    if (user) {
      // Redirect authenticated users
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "INSTRUCTOR") {
        router.push("/instructor/dashboard");
      } else {
        router.push("/dashboard");
      }
    } else if (email) {
      // Store email for OTP form
      setEmail(email);
    } else {
      // No email, redirect to signup
      router.push("/signup");
    }
  }, [user, email, router, setEmail]);

  if (user || !email) {
    return null;
  }


  //todo resend button loading while clicked
  
  return (
    <div className="">
      <VerifyOtpForm />
      
    </div>
  );
}
