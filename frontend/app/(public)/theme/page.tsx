"use client";

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const APP_INFO = {
	name: "Byway",
	version: "1.0.0",
	description: "A modern, elegant platform for online learning and teaching.",
	about:
		"Byway is designed to empower learners and instructors with a seamless, beautiful, and efficient educational experience. Enjoy intuitive navigation, robust features, and a delightful interface—all powered by modern web technologies.",
};

const THEMES = [
	{ value: "nature", label: "Nature" },
	{ value: "sunrise", label: "Sunrise" },
	{ value: "ocean", label: "Ocean" },
	{ value: "forest", label: "Forest" },
	{ value: "midnight", label: "Midnight" },
	{ value: "rose", label: "Rose" },
	{ value: "sand", label: "Sand" },
	{ value: "tech", label: "Tech" },
	{ value: "lime", label: "Lime" },
];

export default function SettingsPage() {
	const { setTheme, theme: currentTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[var(--color-background)]">
			<Card className="w-full max-w-xl border-[var(--color-primary-200)] bg-[var(--color-surface)] shadow-lg">
				<CardHeader>
					<CardTitle className="text-2xl text-[var(--color-primary-dark)]">
						Settings
					</CardTitle>
					<CardDescription className="text-[var(--color-muted)]">
						Manage your Byway experience
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-8">
					<section>
						<h2 className="text-lg font-semibold text-[var(--color-primary-dark)] mb-1">
							About this Application
						</h2>
						<div className="text-[var(--color-primary-dark)] font-medium mb-1">
							{APP_INFO.name}{" "}
							<span className="text-xs text-[var(--color-muted)]">
								v{APP_INFO.version}
							</span>
						</div>
						<div className="text-[var(--color-muted)] mb-2">
							{APP_INFO.description}
						</div>
						<div className="text-sm text-[var(--color-primary-dark)]">
							{APP_INFO.about}
						</div>
					</section>
					<section>
						<h2 className="text-lg font-semibold text-[var(--color-primary-dark)] mb-2">
							Theme
						</h2>
						<div className="flex items-center gap-4">
							<Select
								value={currentTheme || resolvedTheme}
								onValueChange={setTheme}
							>
								<SelectTrigger className="w-48 border-[var(--color-primary-200)] bg-[var(--color-surface)] text-[var(--color-primary-dark)]">
									<SelectValue placeholder="Select theme" />
								</SelectTrigger>
								<SelectContent className="bg-[var(--color-surface)] text-[var(--color-primary-dark)] border-[var(--color-primary-200)]">
									{THEMES.map((theme) => (
										<SelectItem
											key={theme.value}
											value={theme.value}
											className="hover:bg-[var(--color-primary-50)]"
										>
											{theme.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<span className="text-[var(--color-muted)] text-sm">
								Current:{" "}
								<span className="font-semibold text-[var(--color-primary-dark)]">
									{THEMES.find(
										(t) => t.value === (currentTheme || resolvedTheme),
									)?.label || ""}
								</span>
							</span>
						</div>
					</section>
				</CardContent>
			</Card>
		</div>
	);
}
