"use client";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";

export default function ResetPasswordPage() {
	return (
		<AuthPageWrapper redirectIfAuthenticated={true}>
			<ResetPasswordForm />
		</AuthPageWrapper>
	);
}
