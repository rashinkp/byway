// src/components/auth/LoginForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SplitScreenLayout } from "@/components/ui/SplitScreenLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useLogin } from "@/hooks/auth/useLogin";
import { useRoleRedirect } from "@/hooks/useRoleRedirects";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";
import { useFacebookAuth } from "@/hooks/auth/useFacebookAuth";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
	const { mutate: login, isPending, error } = useLogin();
	const {
		handleGoogleAuth,
		isSubmitting,
		error: googleAuthError,
	} = useGoogleAuth();
	const {
		login: facebookLogin,
		isLoading: facebookLoading,
		error: facebookError,
	} = useFacebookAuth();
	const { redirectByRole } = useRoleRedirect();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (data: LoginFormData) => {
		login(
			{ email: data.email, password: data.password },
			{
				onSuccess: (user) => {
					redirectByRole(user.role);
				},
			},
		);
	};

	return (
		<SplitScreenLayout
			title="Learning Reimagined"
			description="Join thousands of students and instructors on our platform to unlock your potential."
			imageAlt="Learning platform illustration"
		>
			<AuthForm
				form={form}
				onSubmit={onSubmit}
				fields={[
					{
						name: "email",
						label: "Email",
						type: "email",
						placeholder: "user@example.com",
					},
					{
						name: "password",
						label: "Password",
						type: "password",
						placeholder: "enter your password",
					},
				]}
				title="Welcome back"
				subtitle="Please enter your details to sign in"
				submitText="Sign in"
				isSubmitting={isPending || isSubmitting || facebookLoading}
				error={googleAuthError || error?.message || facebookError}
				googleAuthText="Continue with Google"
				facebookAuthText="Go with Facebook"
				onFacebookAuth={facebookLogin}
				onGoogleAuth={handleGoogleAuth}
				authLink={{
					text: "Don't have an account?",
					linkText: "Create account",
					href: "/signup",
				}}
				extraLink={{
					text: "",
					linkText: "Forgot password?",
					href: "/forgot-password",
				}}
			/>
		</SplitScreenLayout>
	);
}

export default LoginForm;
