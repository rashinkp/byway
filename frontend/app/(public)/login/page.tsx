"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "INSTRUCTOR") {
        router.push("/instructor/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <div className="">
      <LoginForm />
    </div>
  );
}
