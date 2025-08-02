"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Course } from "@/types/course";
import { deleteCourse } from "@/api/course";
import { ApiResponse, IPaginatedResponse } from "@/types/general";

export function useSoftDeleteCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (course: Course) => {
			await deleteCourse(course.id);
			return course; // Return the course for consistent handling
		},
		onMutate: async (course: Course) => {
			// Cancel any ongoing queries for the course list
			await queryClient.cancelQueries({ queryKey: ["courses", 1, 10, ""] });
			// Cancel the specific course query
			await queryClient.cancelQueries({ queryKey: ["course", course.id] });

			// Optimistically update the course list
			const previousCourses = queryClient.getQueryData<{
				data: Course[];
				total: number;
				page: number;
				limit: number;
			}>(["courses", 1, 10, ""]);

			queryClient.setQueryData(["courses", 1, 10, ""], (old: any) => ({
				data: old?.data.filter((c: Course) => c.id !== course.id) ?? [],
				total: (old?.total ?? 1) - 1,
				page: old?.page || 1,
				limit: old?.limit || 10,
			}));

			// Optimistically update the single course data (optional)
			const previousCourse = queryClient.getQueryData<Course>([
				"course",
				course.id,
			]);
			queryClient.setQueryData(
				["course", course.id],
				(old: Course | undefined) => {
					if (!old) return old;
					return {
						...old,
						deletedAt: old.deletedAt ? null : new Date().toISOString(), // Toggle deletedAt
					};
				},
			);

			return { previousCourses, previousCourse };
		},
		onSuccess: (deletedCourse: Course) => {
			// Update all courses queries in the cache
			queryClient.setQueriesData(
				{ queryKey: ["courses"] },
				(oldData: ApiResponse<IPaginatedResponse<Course>> | undefined) => {
					if (!oldData?.data?.items) return oldData;
					
					return {
						...oldData,
						data: {
							...oldData.data,
							items: oldData.data.items.map((course: Course) =>
								course.id === deletedCourse.id
									? {
											...course,
											deletedAt: course.deletedAt ? null : new Date().toISOString(),
										}
									: course
							),
						},
					};
				}
			);

			// Update single course query if it exists
			queryClient.setQueriesData(
				{ queryKey: ["course", deletedCourse.id] },
				(oldData: ApiResponse<Course> | undefined) => {
					if (!oldData?.data) return oldData;
					
					return {
						...oldData,
						data: {
							...oldData.data,
							deletedAt: oldData.data.deletedAt ? null : new Date().toISOString(),
						},
					};
				}
			);

			toast.success(
				`Successfully ${!deletedCourse.deletedAt ? "Disabled" : "Enabled"} course`,
				{
					description: `Course "${deletedCourse.title}" ${
						!deletedCourse.deletedAt ? "Disabled" : "Enabled"
					} successfully`,
				},
			);
		},
		onError: (error: any, course: Course, context: any) => {
			// Rollback course list
			queryClient.setQueryData(
				["courses", 1, 10, ""],
				context?.previousCourses,
			);
			// Rollback single course
			queryClient.setQueryData(["course", course.id], context?.previousCourse);
			toast.error(`Failed to delete course "${course.title}"`, {
				description: error.message || "Please try again",
			});
		},
	});
}
