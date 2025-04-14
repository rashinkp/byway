"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export function VerifyOtpForm() {
  const router = useRouter();
  const { email, verifyOtp, resendOtp } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: OtpFormData) => {
    if (!email) {
      setError("No email provided");
      return;
    }
    try {
      setError(null);
      await verifyOtp(email, data.otp);
      const role = useAuthStore.getState().user?.role;
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "INSTRUCTOR") {
        router.push("/instructor/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;
    try {
      await resendOtp(email);
      setResendCooldown(30);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
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

  if (!email) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm">No email provided.</p>
          <p className="text-sm text-center mt-4">
            <Link href="/signup" className="underline">
              Go back to signup
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify OTP</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          Enter the 6-digit OTP sent to <strong>{email}</strong>.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={resendCooldown > 0 || form.formState.isSubmitting}
            >
              {resendCooldown > 0
                ? `Resend OTP (${resendCooldown}s)`
                : "Resend OTP"}
            </Button>
            <p className="text-sm text-center">
              Wrong email?{" "}
              <Link href="/signup" className="underline">
                Go back to signup
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
