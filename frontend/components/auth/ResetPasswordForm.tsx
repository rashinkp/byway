// src/components/auth/ResetPasswordForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { SplitScreenLayout } from "@/components/ui/SplitScreenLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { Button } from "@/components/ui/button";
import { AuthLink } from "@/components/auth/parts/AuthLink";
import { AuthFormWrapper } from "./parts/AuthFormWrapper";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!email || !otp) return;
    resetPassword(
      { email, otp, newPassword: data.newPassword },
      {
        onSuccess: () => {
          router.push("/login");
        },
      }
    );
  };

  if (!email || !otp) {
    return (
      <SplitScreenLayout
        title="Reset Password"
        description="Set a new password to regain access to your account."
        imageAlt="Password reset illustration"
      >
        <AuthFormWrapper
          title="Invalid Link"
          subtitle=""
          error="Invalid or expired reset link"
        >
          <Button className="auth-button" asChild>
            <AuthLink
              text=""
              linkText="Back to forgot password"
              href="/forgot-password"
            />
          </Button>
        </AuthFormWrapper>
      </SplitScreenLayout>
    );
  }

  return (
    <SplitScreenLayout
      title="Set New Password"
      description="Create a new password to secure your account and continue learning."
      imageAlt="Password reset illustration"
    >
      <AuthForm
        form={form}
        onSubmit={onSubmit}
        fields={[
          {
            name: "newPassword",
            label: "New Password",
            type: "password",
            placeholder: "••••••",
          },
          {
            name: "confirmPassword",
            label: "Confirm Password",
            type: "password",
            placeholder: "••••••",
          },
        ]}
        title="Reset Password"
        subtitle="Enter your new password below"
        submitText="Reset Password"
        isSubmitting={isPending}
        error={error?.message}
        googleAuthText=""
        onGoogleAuth={() => {}}
        authLink={{
          text: "Remembered your password?",
          linkText: "Back to login",
          href: "/login",
        }}
      />
    </SplitScreenLayout>
  );
}
