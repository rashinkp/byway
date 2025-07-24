"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			style={
				{
					'--normal-bg': theme === 'dark' ? '#18181b' : '#fff',
					'--normal-text': theme === 'dark' ? '#fff' : '#18181b',
					'--normal-border': '#facc15',
					'--success-bg': theme === 'dark' ? '#18181b' : '#fff',
					'--success-text': theme === 'dark' ? '#fff' : '#18181b',
					'--success-border': '#facc15',
					'--error-bg': theme === 'dark' ? '#18181b' : '#fff',
					'--error-text': theme === 'dark' ? '#fff' : '#18181b',
					'--error-border': '#facc15',
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
