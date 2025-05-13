import { useQuery } from "@tanstack/react-query";
import { getAllInstructors } from "@/api/instructor";
import { IInstructorDetails } from "@/types/instructor";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { ApiResponse } from "@/types/apiResponse";

export function useGetAllInstructors() {
  const { user } = useAuthStore();

  interface InstructorsQueryOptions {
    queryKey: ["instructors"];
    queryFn: () => Promise<ApiResponse<IInstructorDetails[]>>;
    enabled: boolean;
    onFailure: (error: Error) => void;
  }

  return useQuery<ApiResponse<IInstructorDetails[]>, Error, ApiResponse<IInstructorDetails[]>, ["instructors"]>({
    queryKey: ["instructors"],
    queryFn: (): Promise<ApiResponse<IInstructorDetails[]>> => {
      if (user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
      }
      return getAllInstructors();
    },
    enabled: !!user && user.role === "ADMIN",
    onFailure: (error: Error): void => {
      console.error("Fetching instructors failed:", error.message);
      toast.error("Failed to Fetch Instructors", {
        description:
          error.message || "Something went wrong while fetching instructors",
      });
    },
  } as InstructorsQueryOptions);
}
