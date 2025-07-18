"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/button";
import { SocialAuthButton } from "@/components/ui/SocialAuthButton";
import { AuthLink } from "@/components/auth/parts/AuthLink";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface FieldConfig<T extends FieldValues> {
	name: Path<T>;
	label: string;
	type: "text" | "email" | "password";
	placeholder: string;
}

interface AuthFormProps<T extends FieldValues> {
	form: UseFormReturn<T>;
	onSubmit: (data: T) => void;
	fields: FieldConfig<T>[];
	title: string;
	subtitle: string;
	submitText: string;
	isSubmitting: boolean;
	error?: string | null;
	googleAuthText: string;
	facebookAuthText: string;
	onGoogleAuth: () => void;
	onFacebookAuth: () => void;
	authLink: { text: string; linkText: string; href: string };
	extraLink?: { text: string; linkText: string; href: string };
}

export function AuthForm<T extends FieldValues>({
	form,
	onSubmit,
	fields,
	title,
	subtitle,
	submitText,
	isSubmitting,
	error,
	googleAuthText,
	facebookAuthText,
	onGoogleAuth,
	onFacebookAuth,
	authLink,
	extraLink,
}: AuthFormProps<T>) {
	return (
		<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] px-4 sm:px-0">
			<div className="flex flex-col space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
				<p className="text-sm text-muted-foreground">{subtitle}</p>
			</div>
			{error && (
				<div className="text-center text-sm text-[var(--color-danger)] rounded py-2 px-3 mb-2">
					{error}
				</div>
			)}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					{fields.map((field) => (
						<FormField
							key={field.name}
							control={form.control}
							name={field.name}
							render={({ field: formField }) => (
								<FormItem>
									<FormLabel className="sr-only">{field.label}</FormLabel>
									<FormControl>
										{field.type === "password" ? (
											<PasswordInput
												placeholder={field.placeholder}
												{...formField}
											/>
										) : (
											<Input
												type={field.type}
												placeholder={field.placeholder}
												{...formField}
											/>
										)}
									</FormControl>
									<FormMessage className="text-[var(--color-danger)]" />
								</FormItem>
							)}
						/>
					))}
					{extraLink && (
						<div className="flex justify-end">
							<AuthLink
								text={extraLink.text}
								linkText={extraLink.linkText}
								href={extraLink.href}
							/>
						</div>
					)}
					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-full mt-2 bg-[#facc15] text-black hover:bg-black hover:text-[#facc15] dark:text-[#facc15] dark:bg-neutral-800 border-none dark:hover:bg-[#facc15] dark:hover:text-black"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Processing...
							</>
						) : (
							submitText
						)}
					</Button>
				</form>
			</Form>
			<div className="flex items-center gap-2">
				<span className="flex-1 border-t border-[var(--color-primary-light)]" />
				<span className="text-xs uppercase text-muted-foreground whitespace-nowrap px-2 bg-background">
					Or continue with
				</span>
				<span className="flex-1 border-t border-[var(--color-primary-light)]" />
			</div>
			<div className="flex flex-col gap-2">
				{googleAuthText && (
					<SocialAuthButton
						provider="google"
						text={googleAuthText}
						onClick={onGoogleAuth}
						isSubmitting={isSubmitting}
					/>
				)}
				{facebookAuthText && (
					<SocialAuthButton
						provider="facebook"
						text={facebookAuthText}
						onClick={onFacebookAuth}
						isSubmitting={isSubmitting}
					/>
				)}
			</div>
			<div className="text-center">
				<AuthLink
					text={authLink.text}
					linkText={authLink.linkText}
					href={authLink.href}
				/>
			</div>
			<p className="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our{" "}
				<Link
					href="/terms"
					className="underline underline-offset-4 hover:text-primary"
				>
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link
					href="/privacy"
					className="underline underline-offset-4 hover:text-primary"
				>
					Privacy Policy
				</Link>
				.
			</p>
		</div>
	);
}
