import { useQuery } from "@tanstack/react-query";
import { getAllInstructors } from "@/api/instructor";
import { IInstructorWithUserDetails } from "@/types/instructor";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { ApiResponse } from "@/types/apiResponse";

export function useGetAllInstructors() {
  const { user } = useAuthStore();

  interface InstructorsQueryOptions {
    queryKey: ["instructors"];
    queryFn: () => Promise<ApiResponse<IInstructorWithUserDetails[]>>;
    enabled: boolean;
    onError: (error: Error) => void; // Changed from onFailure to onError to match useQuery
  }

  return useQuery<
    ApiResponse<IInstructorWithUserDetails[]>,
    Error,
    ApiResponse<IInstructorWithUserDetails[]>,
    ["instructors"]
  >({
    queryKey: ["instructors"],
    queryFn: (): Promise<ApiResponse<IInstructorWithUserDetails[]>> => {
      if (user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
      }
      return getAllInstructors();
    },
    enabled: !!user && user.role === "ADMIN",
    onError: (error: Error): void => {
      console.error("Fetching instructors failed:", error.message);
      toast.error("Failed to Fetch Instructors", {
        description:
          error.message || "Something went wrong while fetching instructors",
      });
    },
  } as InstructorsQueryOptions);
}
