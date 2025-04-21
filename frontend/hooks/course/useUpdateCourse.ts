// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {  } from "@/api/course"; // Adjust path to your API instance
// import { Course } from "@/types/course";
// import { useAuthStore } from "@/stores/auth.store";

// export const useUpdateCourseStatus = () => {
//   const queryClient = useQueryClient();
//   const { user } = useAuthStore();

//   return useMutation<
//     Course,
//     Error,
//     { courseId: string; status: "PUBLISHED" | "DRAFT" }
//   >({
//     mutationFn: async ({ courseId, status }) => {
//       const response = await api.patch<{ data: Course }>(
//         `/courses/${courseId}`,
//         { status },
//       );
//       return response.data.data;
//     },
//     onSuccess: (_, { courseId }) => {
//       queryClient.invalidateQueries({ queryKey: ["course", courseId] });
//     },
//   });
// };
