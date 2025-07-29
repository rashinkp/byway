import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface FacebookAuthRequest {
  accessToken: string;
  userId: string;
  name: string;
  email?: string;
  picture?: string;
}




export interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: "text" | "email" | "password";
  placeholder: string;
}

export interface AuthFormProps<T extends FieldValues> {
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