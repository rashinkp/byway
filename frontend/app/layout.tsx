import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SocketProvider from "@/components/SocketProvider";
import { ThemeProvider } from "@/components/Theme-Provider";

// Load fonts
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// Metadata
export const metadata: Metadata = {
	title: "Byway",
	description: "Learn and Teach Online",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	console.log("[env] showing", process.env.NEXT_PUBLIC_API_URL);
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
				suppressHydrationWarning
			>
				<ThemeProvider
					attribute="data-theme"
					defaultTheme="nature"
					enableSystem={false}
					disableTransitionOnChange
				>
					<SocketProvider />
					<Providers>
						<GoogleOAuthProvider
							clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
						>
							<div className="flex-1 flex flex-col relative">{children}</div>
						</GoogleOAuthProvider>
					</Providers>
					<Toaster richColors position="top-right" />
				</ThemeProvider>
			</body>
		</html>
	);
}
