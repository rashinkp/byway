"use client";

import { useState } from "react";
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
import { SplitScreenLayout } from "@/components/ui/SplitScreenLayout";
import { AuthFormWrapper } from "@/components/auth/parts/AuthFormWrapper";
import { AuthLink } from "@/components/auth/parts/AuthLink";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
	const [error, setError] = useState<string | null>(null);
	const { mutate: forgotPassword, isPending } = useForgotPassword();

	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: ForgotPasswordFormData) => {
		try {
			setError(null);
			forgotPassword(data.email, {
				onError: (err: any) => {
					setError(err.message || "Failed to send reset OTP");
				},
			});
		} catch (err: any) {
			const message = err.message || "Failed to send reset OTP";
			setError(message);
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
									<FormMessage className="text-red-600 dark:text-red-400" />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={isPending} className="w-full mt-2">
							{isPending ? "Sending..." : "Send Reset Code"}
						</Button>
						<div className="flex justify-between">
							<AuthLink text="" linkText="Back to login" href="/login" />
						</div>
					</form>
				</Form>
			</AuthFormWrapper>
		</SplitScreenLayout>
	);
}
