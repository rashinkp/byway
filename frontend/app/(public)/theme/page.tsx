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
	{ value: "light", label: "Light" },
	{ value: "dark", label: "Dark" },
	{ value: "system", label: "System" },
];

export default function SettingsPage() {
	const { setTheme, theme: currentTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white dark:bg-[#18181b]">
			<Card className="w-full max-w-xl border-gray-200 bg-white dark:bg-[#232323] shadow-lg mb-10">
				<CardHeader>
					<CardTitle className="text-2xl text-black dark:text-white">
						Settings
					</CardTitle>
					<CardDescription className="text-gray-500 dark:text-gray-300">
						Manage your Byway experience
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-8">
					<section>
						<h2 className="text-lg font-semibold text-black dark:text-white mb-1">
							Theme
						</h2>
						<div className="flex items-center gap-4">
							<Select
								value={currentTheme || resolvedTheme}
								onValueChange={setTheme}
							>
								<SelectTrigger className="w-48 border-gray-200 bg-white dark:bg-[#232323] text-black dark:text-white">
									<SelectValue placeholder="Select theme" />
								</SelectTrigger>
								<SelectContent className="bg-white dark:bg-[#232323] text-black dark:text-white border-gray-200">
									{THEMES.map((theme) => (
										<SelectItem
											key={theme.value}
											value={theme.value}
											className="hover:bg-gray-100 dark:hover:bg-[#232323]/80"
										>
											{theme.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<span className="text-gray-500 dark:text-gray-300 text-sm">
								Current:{" "}
								<span className="font-semibold text-black dark:text-white">
									{THEMES.find(
									(t) => t.value === (currentTheme || resolvedTheme),
									)?.label || ""}
								</span>
							</span>
						</div>
					</section>
				</CardContent>
			</Card>

      {/* About Byway Section */}
      <Card className="w-full max-w-xl border-gray-200 bg-white dark:bg-[#232323] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-black dark:text-white mb-2">About Byway</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="block text-base font-semibold text-[#facc15] mb-1">{APP_INFO.name} v{APP_INFO.version}</span>
            <p className="text-gray-700 dark:text-gray-200 mb-2">{APP_INFO.description}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{APP_INFO.about}</p>
          </div>
        </CardContent>
      </Card>
		</div>
	);
}
