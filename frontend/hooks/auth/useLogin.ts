import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useAuthActions } from "./useAuthActions";

export function useLogin() {
	const { loginUser } = useAuthActions();
	const router = useRouter();

	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) =>
			login(email, password),
		onSuccess: (user) => {

			loginUser(user);

			const redirectPath =
				user.role === "ADMIN"
					? "/admin"
					: user.role === "INSTRUCTOR"
						? "/instructor"
						: "/";
			router.push(redirectPath);
		},
		onError: (error: Error) => {
			console.error("Login failed:", error.message);
		},
	});
}
