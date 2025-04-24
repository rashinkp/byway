// src/components/auth/SignupForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SplitScreenLayout } from "@/components/ui/SplitScreenLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useSignup } from "@/hooks/auth/useSignup";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const { mutate: signup, isPending, error } = useSignup();
  const {error:googelAuthError ,isSubmitting , handleGoogleAuth } = useGoogleAuth()


  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignupFormData) => {
    console.log(data)
    signup(
      { name: data.name, email: data.email, password: data.password },
      {
        onSuccess: () => {
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        },
      }
    );
  };


  return (
    <SplitScreenLayout
      title="Start Your Journey"
      description="Create an account today and gain access to our comprehensive learning platform with expert-led courses."
      imageAlt="Learning platform signup illustration"
    >
      <AuthForm
        form={form}
        onSubmit={onSubmit}
        fields={[
          {
            name: "name",
            label: "Full Name",
            type: "text",
            placeholder: "John Doe",
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "user@example.com",
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "••••••",
          },
        ]}
        title="Create account"
        subtitle="Join our platform to start learning"
        submitText="Create account"
        isSubmitting={isPending || isSubmitting}
        error={error?.message || googelAuthError}
        googleAuthText="Sign up with Google"
        onGoogleAuth={handleGoogleAuth}
        authLink={{
          text: "Already have an account?",
          linkText: "Sign in",
          href: "/login",
        }}
      />
    </SplitScreenLayout>
  );
}
