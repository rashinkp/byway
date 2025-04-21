// src/components/auth/VerifyOtpForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clock, Loader2 } from "lucide-react";
import { SplitScreenLayout } from "@/components/ui/SplitScreenLayout";
import { AuthFormWrapper } from "@/components/auth/parts/AuthFormWrapper";
import { AuthLink } from "@/components/auth/parts/AuthLink";
import { OtpInput } from "@/components/otp/OtpInput";
import { useResendOtp } from "@/hooks/auth/useResendOtp";
import { useVerifyOtp } from "@/hooks/auth/useVerifyOtp";
import { useAuthStore } from "@/stores/auth.store";
import { useRoleRedirect } from "@/hooks/useRoleRedirects";

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "signup";
  const email = useAuthStore((state) => state.email);
  const { mutate: verifyOtp, isPending: isSubmitting, error } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();
  const { redirectByRole } = useRoleRedirect();
  const [resendCooldown, setResendCooldown] = useState(60);
  //persist time in while reloading;


  const handleSubmit = (otp: string) => {
    if (!email) return;
    
    // Map frontend type to backend type
    const verificationType = type === "forgot-password" ? "password-reset" : "signup";
    
    verifyOtp(
      { email, otp, type: verificationType },
      {
        onSuccess: (user) => {
          if (type === "forgot-password") {
            router.push(
              `/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`
            );
          } else {
            redirectByRole(user.role);
          }
        },
      }
    );
  };

  const handleResend = () => {
    if (!email || resendCooldown > 0 || isResending) return;
    resendOtp(email, {
      onSuccess: () => setResendCooldown(60),
    });
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!email) {
    return (
      <SplitScreenLayout
        title="Verification Required"
        description="We need to verify your email address before you can access your account."
        imageAlt="Verification illustration"
      >
        <AuthFormWrapper
          title="Verification Failed"
          subtitle=""
          error="No email provided"
        >
          <Button className="auth-button" asChild>
            <AuthLink
              text=""
              linkText={
                type === "forgot-password"
                  ? "Back to forgot password"
                  : "Go back to signup"
              }
              href={type === "forgot-password" ? "/forgot-password" : "/signup"}
            />
          </Button>
        </AuthFormWrapper>
      </SplitScreenLayout>
    );
  }

  return (
    <SplitScreenLayout
      title={
        type === "forgot-password" ? "Reset Your Password" : "Almost There!"
      }
      description={
        type === "forgot-password"
          ? "Verify your email to proceed with resetting your password."
          : "Complete the verification process to access your new account and start your learning journey."
      }
      imageAlt="Verification illustration"
    >
      <AuthFormWrapper
        title="Verify Your Email"
        subtitle={`Enter the 6-digit code sent to ${email}`}
        error={error?.message}
        noCard
      >
        <div className="mb-8">
          <OtpInput onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              {resendCooldown > 0 ? (
                <span>
                  Resend code in{" "}
                  <span className="font-medium">
                    {formatTime(resendCooldown)}
                  </span>
                </span>
              ) : (
                <span>Didn't receive the code?</span>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full py-4 text-base"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isSubmitting || isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend code"
            )}
          </Button>
          <AuthLink
            text="Wrong email?"
            linkText={
              type === "forgot-password"
                ? "Back to forgot password"
                : "Go back to signup"
            }
            href={type === "forgot-password" ? "/forgot-password" : "/signup"}
          />
        </div>
      </AuthFormWrapper>
    </SplitScreenLayout>
  );
}
