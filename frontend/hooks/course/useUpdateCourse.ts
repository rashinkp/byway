import { updateCourse } from "@/api/course";
import { Course, CourseEditFormData } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
			const previousCourses = queryClient.getQueryData<any>(["courses"]);

			queryClient.setQueryData(["courses"], (old: any) => {
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
				(oldData: any) => {
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
			error: any,
			variables: { id: string; data: CourseEditFormData },
			context: any,
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
