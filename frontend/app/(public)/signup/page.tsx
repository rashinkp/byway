"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  // useEffect(() => {
  //   if (user) {
  //     if (user.role === "ADMIN") {
  //       router.push("/admin/dashboard");
  //     } else if (user.role === "INSTRUCTOR") {
  //       router.push("/instructor/dashboard");
  //     } else {
  //       router.push("/dashboard");
  //     }
  //   }
  // }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <div className="">
      <SignupForm />
    </div>
  );
}
