// src/components/auth/LoginPage.tsx
"use client";

// import dynamic from "next/dynamic";
import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
	return (
		<AuthPageWrapper redirectIfAuthenticated={true}>
			<LoginForm />
		</AuthPageWrapper>
	);
}
