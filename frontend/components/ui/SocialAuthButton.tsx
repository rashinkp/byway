"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SocialAuthButtonProps {
	provider: "google" | "facebook";
	text: string;
	onClick: () => void;
	isSubmitting: boolean;
}

export function SocialAuthButton({
	provider,
	text,
	onClick,
	isSubmitting,
}: SocialAuthButtonProps) {
	const getProviderProps = (provider: "google" | "facebook") => {
		switch (provider) {
			case "google":
				return {
					variant: "secondary" as const,
					icon: (
						<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.52 7.77 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.77 1 4.01 3.48 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
					),
					className: "w-full flex items-center justify-center font-medium bg-[#facc15] text-black border-none dark:bg-[#18181b] dark:text-[#facc15] dark:border-none",
				};
			case "facebook":
				return {
					variant: "default" as const,
					icon: (
						<svg
							className="w-5 h-5 mr-2"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
						</svg>
					),
					className: "w-full flex items-center justify-center font-medium bg-[#18181b] text-[#facc15] border-none dark:bg-[#facc15] dark:text-black dark:border-none",
				};
		}
	};

	const { variant, icon, className: providerClassName } = getProviderProps(provider);

	return (
		<Button
			type="button"
			variant={variant}
			className={providerClassName}
			onClick={onClick}
			disabled={isSubmitting}
		>
			{isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : icon}
			{isSubmitting ? "Processing..." : text}
		</Button>
	);
}
