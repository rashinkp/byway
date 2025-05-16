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
    onSuccess: (data) => {
      const userEmail = data?.data?.user?.email;
      console.log("Signup response:", data);
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
      toast.error("Signup failed", {
        description: error.message || "Something went wrong",
      });
    },
  });
}
