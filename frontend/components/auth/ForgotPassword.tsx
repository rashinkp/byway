"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const { forgotPassword } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setError(null);
      await forgotPassword(data.email);
      toast.success("Reset OTP Sent", {
        description: "A verification code has been sent to your email.",
        duration: 5000,
      });
      router.push(
        `/verify-otp?email=${encodeURIComponent(
          data.email
        )}&type=forgot-password`
      );
    } catch (err: any) {
      const message = err.message || "Failed to send reset OTP";
      setError(message);
      toast.error("Error", {
        description: message,
        duration: 5000,
      });
    }
  };

  return (
    <SplitScreenLayout
      title="Reset Your Password"
      description="Enter your email to receive a verification code and regain access to your account."
      imageAlt="Password reset illustration"
    >
      <AuthFormWrapper
        title="Forgot Password"
        subtitle="Enter your email to reset your password"
        error={error}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
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
              {form.formState.isSubmitting ? "Sending..." : "Send Reset Code"}
            </Button>
            <div className="flex justify-between">
              <AuthLink text="" linkText="Back to login" href="/login" />
              <AuthLink text="" linkText="Create account" href="/signup" />
            </div>
          </form>
        </Form>
      </AuthFormWrapper>
    </SplitScreenLayout>
  );
}
