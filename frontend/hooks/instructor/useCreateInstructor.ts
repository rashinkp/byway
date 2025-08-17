import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInstructor } from "@/api/instructor";
import { InstructorFormData } from "@/types/instructor";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { ApiResponse } from "@/types/general";
import { IInstructorWithUserDetails } from "@/types/instructor";

// Interface for the instructor creation response from the backend
interface InstructorCreationResponse {
	id: string;
	userId: string;
	areaOfExpertise: string;
	professionalExperience: string;
	about?: string;
	website?: string;
	education: string;
	certifications: string;
	cv: string;
	status: string;
	totalStudents: number;
	createdAt: string | Date;
	updatedAt: string | Date;
	user: {
		id: string;
		name: string;
		email: string;
		role: "USER" | "INSTRUCTOR" | "ADMIN";
		avatar?: string;
	};
}

// Interface for API errors
interface ApiErrorResponse {
	response?: {
		status: number;
		data?: {
			message?: string;
		};
	};
	message?: string;
}

export function useCreateInstructor() {
	const { user } = useAuthStore();
	const queryClient = useQueryClient();

	return useMutation<ApiResponse<InstructorCreationResponse>, ApiErrorResponse, InstructorFormData>({
		mutationFn: (data: InstructorFormData) => createInstructor(data),
		onSuccess: (response) => {
			// Update the instructor cache directly with the new data
			// This prevents unnecessary backend requests
			const newInstructorData: IInstructorWithUserDetails = {
				id: response.data.id,
				userId: response.data.userId,
				areaOfExpertise: response.data.areaOfExpertise,
				professionalExperience: response.data.professionalExperience,
				about: response.data.about,
				website: response.data.website,
				education: response.data.education,
				certifications: response.data.certifications || "",
				cv: response.data.cv,
				status: "PENDING",
				totalStudents: response.data.totalStudents,
				createdAt: response.data.createdAt.toString(),
				updatedAt: response.data.updatedAt.toString(),
				user: {
					id: response.data.user.id,
					name: response.data.user.name,
					email: response.data.user.email,
					role: response.data.user.role,
					avatar: response.data.user.avatar,
					createdAt: response.data.createdAt.toString(),
				},
			};
			
			queryClient.setQueryData(
				["instructor", user?.id],
				{ data: newInstructorData, success: true, message: "Instructor data updated" }
			);
			
			toast.success("Instructor application submitted successfully!", {
				description: "Your application is under review.",
			});
		},
		onError: (error: ApiErrorResponse) => {
			console.error(
				"Instructor creation failed:",
				JSON.stringify(error, null, 2),
			);

			// Handle different error types
			let errorMessage = "Something went wrong while applying";

			if (error?.response?.status === 404) {
				errorMessage = "User not found. Please try logging in again.";
			} else if (error?.response?.status === 400) {
				errorMessage =
					error?.response?.data?.message || "Invalid application data";
			} else if (error?.response?.status === 403) {
				errorMessage = "You are not authorized to perform this action";
			} else if (error?.response?.status === 409) {
				errorMessage = "You already have a pending application";
			} else if (error?.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error?.message) {
				errorMessage = error.message;
			}

			toast.error("Instructor Apply Failed", {
				description: errorMessage,
			});
		},
	});
}
