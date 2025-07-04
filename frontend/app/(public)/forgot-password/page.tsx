"use client";

import { ForgotPasswordForm } from "@/components/auth/ForgotPassword";
import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";

export default function ForgotPasswordPage() {
	return (
		<AuthPageWrapper redirectIfAuthenticated={true}>
			<ForgotPasswordForm />
		</AuthPageWrapper>
	);
}
