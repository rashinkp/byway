"use client";

import { VerifyOtpForm } from "@/components/auth/OtpForm";
import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";

export default function VerifyOtpPage() {
	return (
		<AuthPageWrapper redirectIfAuthenticated={true}>
			<VerifyOtpForm />
		</AuthPageWrapper>
	);
}
