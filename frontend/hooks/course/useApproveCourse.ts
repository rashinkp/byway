import { approveCourse, declineCourse } from "@/api/course";
import { Course } from "@/types/course";
import { IUpdateCourseApprovalInput } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseCourseApprovalReturn {
	mutate: (input: IUpdateCourseApprovalInput) => void;
	isPending: boolean;
	error: { message: string } | null;
}

export function useApproveCourse(): UseCourseApprovalReturn {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation<
		Course,
		Error,
		IUpdateCourseApprovalInput
	>({
		mutationFn: approveCourse,
		onSuccess: (response, input) => {
			// Update all courses queries in the cache
			queryClient.setQueriesData(
				{ queryKey: ["courses"] },
				(oldData: { courses: Course[] } | undefined) => {
					if (!oldData?.courses) return oldData;
					
					return {
						...oldData,
						courses: oldData.courses.map((course: Course) =>
							course.id === input.courseId
								? {
										...course,
										approvalStatus: "APPROVED",
									}
								: course
						),
					};
				}
			);

			// Update individual course cache
			queryClient.setQueriesData(
				{ queryKey: ["course", input.courseId] },
				(oldData: Course | undefined) => {
					if (!oldData) return oldData;
					
					return {
						...oldData,
						approvalStatus: "APPROVED",
					};
				}
			);

			// Update instructor courses cache
			queryClient.setQueriesData(
				{ queryKey: ["instructor-courses"] },
				(oldData: { data: { items: Course[] } } | undefined) => {
					if (!oldData?.data?.items) return oldData;
					
					return {
						...oldData,
						data: {
							...oldData.data,
							items: oldData.data.items.map((course: Course) =>
								course.id === input.courseId
									? {
											...course,
											approvalStatus: "APPROVED",
										}
									: course
							),
						},
					};
				}
			);

			toast.success("Course approved successfully!");
		},
		onError: (err) => {
			toast.error("Failed to approve course", {
				description: err.message || "Please try again",
			});
		},
	});

	return {
		mutate,
		isPending,
		error: error ? { message: error.message } : null,
	};
}

export function useDeclineCourse(): UseCourseApprovalReturn {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation<
		Course,
		Error,
		IUpdateCourseApprovalInput
	>({
		mutationFn: declineCourse,
		onSuccess: (response, input) => {
			// Update all courses queries in the cache
			queryClient.setQueriesData(
				{ queryKey: ["courses"] },
				(oldData: { courses: Course[] } | undefined) => {
					if (!oldData?.courses) return oldData;
					
					return {
						...oldData,
						courses: oldData.courses.map((course: Course) =>
							course.id === input.courseId
								? {
										...course,
										approvalStatus: "DECLINED",
									}
								: course
						),
					};
				}
			);

			// Update individual course cache
			queryClient.setQueriesData(
				{ queryKey: ["course", input.courseId] },
				(oldData: Course | undefined) => {
					if (!oldData) return oldData;
					
					return {
						...oldData,
						approvalStatus: "DECLINED",
					};
				}
			);

			// Update instructor courses cache
			queryClient.setQueriesData(
				{ queryKey: ["instructor-courses"] },
				(oldData: { data: { items: Course[] } } | undefined) => {
					if (!oldData?.data?.items) return oldData;
					
					return {
						...oldData,
						data: {
							...oldData.data,
							items: oldData.data.items.map((course: Course) =>
								course.id === input.courseId
									? {
											...course,
											approvalStatus: "DECLINED",
										}
									: course
							),
						},
					};
				}
			);

			toast.success("Course declined successfully!");
		},
		onError: (err) => {
			toast.error("Failed to decline course", {
				description: err.message || "Please try again",
			});
		},
	});

	return {
		mutate,
		isPending,
		error: error ? { message: error.message } : null,
	};
}
