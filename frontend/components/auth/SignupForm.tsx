// src/components/auth/SignupForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SplitScreenLayout } from "@/components/ui/SplitScreenLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useSignup } from "@/hooks/auth/useSignup";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";
import { useFacebookAuth } from "@/hooks/auth/useFacebookAuth";

const signupSchema = z.object({
	name: z.string()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be less than 50 characters")
		.regex(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods")
		.regex(/^[a-zA-Z]/, "Name must start with a letter")
		.regex(/[a-zA-Z]$/, "Name must end with a letter")
		.refine((name) => !/\s{2,}/.test(name), "Name cannot contain consecutive spaces")
		.refine((name) => !/^[^a-zA-Z]*$/.test(name), "Name must contain at least one letter"),
	email: z.string().email("Invalid email address"),
	password: z.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
		.regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
		.regex(/^(?=.*\d)/, "Password must contain at least one number")
		.regex(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character (@$!%*?&)")
		.regex(/^\S*$/, "Password cannot contain whitespace")
		.max(128, "Password must be less than 128 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
	const router = useRouter();
	const { mutate: signup, isPending, error } = useSignup();
	const {
		error: googelAuthError,
		isSubmitting,
		handleGoogleAuth,
	} = useGoogleAuth();

	const {
		login: facebookLogin,
		isLoading: facebookLoading,
		error: facebookError,
	} = useFacebookAuth();

	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = (data: SignupFormData) => {
		console.log(data);
		signup(
			{ name: data.name, email: data.email, password: data.password },
			{
				onSuccess: () => {
					router.push(`/verify-otp?type=signup`);
				},
			},
		);
	};

	return (
		<SplitScreenLayout
			title="Start Your Journey"
			description="Create an account today and gain access to our comprehensive learning platform with expert-led courses."
			imageAlt="Learning platform signup illustration"
		>
			<AuthForm
				form={form}
				onSubmit={onSubmit}
				fields={[
					{
						name: "name",
						label: "Full Name",
						type: "text",
						placeholder: "John Doe",
					},
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
				title="Create account"
				subtitle="Join our platform to start learning"
				submitText="Create account"
				isSubmitting={isPending || isSubmitting || facebookLoading}
				error={error?.message || googelAuthError || facebookError}
				googleAuthText="Sign up with Google"
				onGoogleAuth={handleGoogleAuth}
				onFacebookAuth={facebookLogin}
				facebookAuthText="Create account with facebook"
				authLink={{
					text: "Already have an account?",
					linkText: "Sign in",
					href: "/login",
				}}
			/>
		</SplitScreenLayout>
	);
}
