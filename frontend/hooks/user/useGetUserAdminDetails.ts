import { useQuery } from "@tanstack/react-query";
import { getUserAdminDetails } from "@/api/users";
import { User } from "@/types/user";
import { IInstructorWithUserDetails } from "@/types/instructor";

interface UserAdminDetails extends Omit<User, "instructor"> {
	instructor?: IInstructorWithUserDetails;
}

export const useGetUserAdminDetails = (userId: string) => {
	return useQuery<UserAdminDetails>({
		queryKey: ["user-admin-details", userId],
		queryFn: () => getUserAdminDetails(userId),
		enabled: !!userId,
	});
};
