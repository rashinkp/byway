"use client";

import { useSearchParams } from "next/navigation";
import { VerifyOtpForm } from "@/components/auth/OtpForm";
import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // If no email is provided, show error
  if (!email) {
    return (
      <AuthPageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
          <div className="w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
            <p className="text-gray-600 mb-6">No email provided for verification.</p>
            <a 
              href="/signup" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go back to signup
            </a>
          </div>
        </div>
      </AuthPageWrapper>
    );
  }

  return (
    <AuthPageWrapper redirectIfAuthenticated={true}>
      <VerifyOtpForm />
    </AuthPageWrapper>
  );
}
