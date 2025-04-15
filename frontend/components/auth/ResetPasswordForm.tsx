"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SplitScreenLayout } from "@/components/ui/SplitScreenLayout";
import { AuthFormWrapper } from "@/components/auth/parts/AuthFormWrapper";
import { AuthLink } from "@/components/auth/parts/AuthLink";

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
  const { resetPassword } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email || !otp) {
      setError("Invalid reset link");
      return;
    }

    try {
      setError(null);
      await resetPassword(email, otp, data.newPassword);
      toast.success("Password Updated", {
        description:
          "Your password has been successfully updated. Please log in.",
        duration: 5000,
      });
      router.push("/login");
    } catch (err: any) {
      const message = err.message || "Failed to reset password";
      setError(message);
      toast.error("Error", {
        description: message,
        duration: 5000,
      });
    }
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
      <AuthFormWrapper
        title="Reset Password"
        subtitle="Enter your new password below"
        error={error}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••"
                      className="auth-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••"
                      className="auth-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="auth-button"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
            <AuthLink
              text="Remembered your password?"
              linkText="Back to login"
              href="/login"
            />
          </form>
        </Form>
      </AuthFormWrapper>
    </SplitScreenLayout>
  );
}
