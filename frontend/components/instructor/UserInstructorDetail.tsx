import React from "react";
import { InstructorDetailBase } from "./InstructorDetailBase";
import { IInstructorDetails } from "@/types/instructor";
import { Course } from "@/types/course";

interface UserInstructorDetailProps {
	instructor: IInstructorDetails;
	courses?: Course[];
	isCoursesLoading?: boolean;
}

export const UserInstructorDetail: React.FC<UserInstructorDetailProps> = ({
	instructor,
	courses,
	isCoursesLoading,
}) => {
	return (
		<InstructorDetailBase
			instructor={instructor}
			courses={courses}
			isCoursesLoading={isCoursesLoading}
		/>
	);
};
