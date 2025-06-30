  // src/components/auth/LoginPage.tsx
  "use client";

  import dynamic from "next/dynamic";
  import { AuthPageWrapper } from "@/components/auth/AuthPageWrapper";

  const LoginForm = dynamic(
  () => import("@/components/auth/LoginForm").then((mod) => mod.LoginForm),
  {
    ssr: false,
    loading: () => null,
  }
  );

  export default function LoginPage() {
  return (
    <AuthPageWrapper redirectIfAuthenticated={true}>
      <LoginForm />
    </AuthPageWrapper>
  );
  }
