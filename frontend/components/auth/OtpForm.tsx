"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock, Loader2 } from "lucide-react";
import { SplitScreenLayout } from "@/components/ui/SplitScreenLayout";
import { AuthFormWrapper } from "@/components/auth/parts/AuthFormWrapper";
import { AuthLink } from "@/components/auth/parts/AuthLink";

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "signup";
  const { email, verifyOtp, resendOtp } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  const isValidOtp = (otpArray: string[]) => {
    const otpString = otpArray.join("");
    return otpString.length === 6 && /^\d+$/.test(otpString);
  };

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    if (value.length > 1) {
      const pastedValues = value.split("").slice(0, 6);
      const newFilledOtp = [...Array(6).fill("")];

      pastedValues.forEach((val, idx) => {
        if (idx < 6) newFilledOtp[idx] = val;
      });

      setOtp(newFilledOtp);

      const nextIndex = Math.min(index + pastedValues.length, 5);
      if (nextIndex < 6) {
        inputRefs.current[nextIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
        if (isValidOtp(newFilledOtp)) {
          submitOtp(newFilledOtp.join(""));
        }
      }
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((val) => val !== "") && isValidOtp(newOtp)) {
      submitOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitOtp = async (otpValue: string) => {
    if (!email) {
      setError("No email provided");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await verifyOtp(email, otpValue);
      const role = useAuthStore.getState().user?.role;

      if (type === "forgot-password") {
        router.push(
          `/reset-password?email=${encodeURIComponent(email)}&otp=${otpValue}`
        );
      } else {
        if (role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (role === "INSTRUCTOR") {
          router.push("/instructor/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
      toast.success("Email Verified", {
        description: "Your email has been successfully verified.",
        duration: 5000,
      });
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
      setIsSubmitting(false);
      toast.error("Invalid OTP", {
        description: err.message || "The OTP you entered is incorrect.",
        duration: 5000,
      });
    }
  };

  const handleResend = async () => {
    if (!email || resendCooldown > 0 || isResending) return;

    try {
      setIsResending(true);
      await resendOtp(email);
      setResendCooldown(30);
      setError(null);
      toast.success("OTP Resent", {
        description: "A new verification code has been sent to your email.",
        duration: 5000,
      });
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
      toast.error("Failed to Resend OTP", {
        description:
          err.message || "An error occurred while resending the OTP.",
        duration: 5000,
      });
    } finally {
      setIsResending(false);
    }
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
        error={error}
        noCard
      >
        <div className="mb-8">
          <div className="flex justify-center gap-2 md:gap-3 mb-6">
            {otp.map((digit, index) => (
              <div key={index} className="relative">
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  value={digit}
                  maxLength={6}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-12 md:w-12 md:h-14 text-center text-lg border-2 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  disabled={isSubmitting}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="auth-button"
            onClick={() => submitOtp(otp.join(""))}
            disabled={isSubmitting || !isValidOtp(otp)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
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
