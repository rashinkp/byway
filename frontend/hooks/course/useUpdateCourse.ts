import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Course, CourseEditFormData } from "@/types/course";
import { updateCourse } from "@/api/course";

export const useUpdateCourse = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: CourseEditFormData;
		}) => {
			const updatedCourse = await updateCourse(id, data);
			return updatedCourse;
		},
		onMutate: async ({
			id,
			data,
		}: {
			id: string;
			data: CourseEditFormData;
		}) => {
			// Cancel any ongoing queries for the course list
			await queryClient.cancelQueries({ queryKey: ["courses"] });
			// Cancel the specific course query
			await queryClient.cancelQueries({ queryKey: ["course", id] });

			// Optimistically update the course list
			const previousCourses = queryClient.getQueryData<{ courses: Course[] }>(["courses"]);

			queryClient.setQueryData(["courses"], (old: { courses: Course[] } | undefined) => {
				if (!old?.courses) return old;
				return {
					...old,
					courses: old.courses.map((c: Course) =>
						c.id === id ? { ...c, ...data } : c,
					),
				};
			});

			const previousCourse = queryClient.getQueryData<Course>(["course", id]);
			queryClient.setQueryData(["course", id], (old: Course | undefined) => {
				if (!old) return old;
				return { ...old, ...data };
			});

			return { previousCourses, previousCourse };
		},
		onSuccess: (data: Course) => {
			// Update all courses queries in the cache
			queryClient.setQueriesData(
				{ queryKey: ["courses"] },
				(oldData: { courses: Course[] } | undefined) => {
					if (!oldData?.courses) return oldData;
					
					return {
						...oldData,
						courses: oldData.courses.map((course: Course) =>
							course.id === data.id ? data : course
						),
					};
				}
			);

			// Update individual course cache
			queryClient.setQueriesData(
				{ queryKey: ["course", data.id] },
				data
			);

			toast.success("Course updated!", {
				description: "The course has been updated successfully.",
			});
			console.log("Course updated successfully:", data);
		},
		onError: (
			error: Error,
			variables: { id: string; data: CourseEditFormData },
			context: { previousCourses: { courses: Course[] } | undefined; previousCourse: Course | undefined } | undefined,
		) => {
			// Rollback course list
			queryClient.setQueryData(
				["courses"],
				context?.previousCourses,
			);
			// Rollback single course
			queryClient.setQueryData(
				["course", variables.id],
				context?.previousCourse,
			);
			console.log("error", error);

			toast.error("Course updation failed!", {
				description:
					error.message || "The course updation failed try again later.",
			});
		},
	});
};
