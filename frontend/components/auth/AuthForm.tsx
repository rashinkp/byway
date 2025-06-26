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
import { Separator } from "@/components/ui/separator";
import { SocialAuthButton } from "@/components/ui/SocialAuthButton";
import { AuthFormWrapper } from "@/components/auth/parts/AuthFormWrapper";
import { AuthLink } from "@/components/auth/parts/AuthLink";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

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
    <AuthFormWrapper title={title} subtitle={subtitle} error={error}>
      {(googleAuthText || facebookAuthText) && (
        <div className="space-y-4">
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
      )}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {field.label}
                  </FormLabel>
                  <FormControl>
                    {field.type === "password" ? (
                      <PasswordInput
                        placeholder={field.placeholder}
                        className="auth-input"
                        {...formField}
                      />
                    ) : (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="auth-input"
                        {...formField}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : submitText}
          </Button>
          <div className="text-center">
            <AuthLink
              text={authLink.text}
              linkText={authLink.linkText}
              href={authLink.href}
            />
          </div>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}
