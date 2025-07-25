"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn";

interface PasswordInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="relative group">
			<Input
				type={showPassword ? "text" : "password"}
				className={cn("pr-10", className)}
				{...props}
			/>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="absolute right-0 top-0 h-full px-3 py-2 bg-transparent shadow-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
				onClick={togglePasswordVisibility}
				aria-label={showPassword ? "Hide password" : "Show password"}
			>
				{showPassword ? (
					<EyeOff className="h-4 w-4 text-black dark:text-white" />
				) : (
					<Eye className="h-4 w-4 text-black dark:text-white" />
				)}
			</Button>
		</div>
	);
}
