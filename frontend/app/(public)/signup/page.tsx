"use client";

import { SignupForm } from "@/components/auth/SignupForm";
import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";

export default function SignupPage() {
  return (
    <AuthPageWrapper redirectIfAuthenticated={true}>
      <SignupForm />
    </AuthPageWrapper>
  );
}
