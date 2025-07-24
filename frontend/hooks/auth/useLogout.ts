import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "@/api/auth";
import { useAuthActions } from "./useAuthActions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useLogout() {
	const { logoutUser } = useAuthActions();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const mutation = useMutation({
		mutationFn: async () => {
			setLoading(true);
			setError(null);
			await logout();
		},
		onSuccess: () => {
			logoutUser();
			router.push("/login");
			setLoading(false);
		},
		onError: (error: any) => {
			setLoading(false);
			setError(error.message || "Something went wrong");
			toast.error("Logout failed", {
				description: error.message || "Something went wrong",
			});
		},
	});

	const resetError = () => setError(null);

	return {
		logout: mutation.mutate,
		isLoading: loading || mutation.isPending,
		error,
		resetError,
	};
}
