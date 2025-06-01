import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { signup } from "@/api/auth";
import { useAuthStore } from "@/stores/auth.store";

export function useSignup() {
  const { setEmail } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => signup({ name, email, password }),
    onSuccess: (response) => {
    
      if (!response?.success) {
        toast.error("Signup failed", {
          description: response?.message || "Something went wrong",
        });
        return;
      }

      const userEmail = response.data?.email;
      if (userEmail) {
        setEmail(userEmail);
        toast.success("Signed up successfully", {
          description: "Please verify your email with the OTP sent.",
        });
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      } else {
        toast.error("Signup failed", {
          description: "Unable to retrieve email from response",
        });
      }
    },
    onError: (error: any) => {
      console.error("Signup error:", error);
      toast.error("Signup failed", {
        description: error.message || "Something went wrong",
      });
    },
  });
}
