import { User, PublicUser } from "@/types/user";
import CourseInstructorSkeleton from "./CourseInstructorSkeleton";
import Link from "next/link";
import Image from "next/image";

interface CourseInstructorProps {
	instructor: (User | PublicUser) | undefined;
	isLoading: boolean;
	userRole?: "USER" | "ADMIN" | "INSTRUCTOR";
}

export default function CourseInstructor({
	instructor,
	isLoading,
	userRole = "USER",
}: CourseInstructorProps) {
	if (isLoading) {
		return <CourseInstructorSkeleton />;
	}
	if (!instructor) return null;

	// Generate instructor link based on user role
	const getInstructorLink = (instructorId: string) => {
		switch (userRole) {
			case "ADMIN":
				return `/admin/instructors/${instructorId}`;
			case "INSTRUCTOR":
				return `/instructor/instructors/${instructorId}`;
			default:
				return `/instructors/${instructorId}`;
		}
	};

	return (
		<Link
			href={getInstructorLink(instructor.id)}
			className="block transition-colors rounded-lg"
		>
			<div className="space-y-8">
				<div className="flex items-start space-x-6">
					<div className="w-16 h-16 rounded-full overflow-hidden bg-white">
						{instructor?.avatar ? (
							<Image
								src={instructor.avatar}
								alt={instructor.name}
								className="w-full h-full object-cover"
								width={64}
								height={64}
							/>
						) : (
							<div className="w-full h-full bg-[#facc15] flex items-center justify-center text-xl font-bold">
								{instructor?.name?.charAt(0) || "I"}
							</div>
						)}
					</div>
					<div className="flex-1">
						<h2 className="text-xl font-semibold  hover:text-[#facc15] transition-colors">
							{instructor?.name}
						</h2>
						{"email" in instructor && instructor.email && (
							<p className="text-gray-600 mt-1">{instructor.email}</p>
						)}
						<div className="mt-4 space-y-2">
							<p className="text-sm ">{instructor?.bio}</p>
							<p className="text-sm ">{instructor?.education}</p>
							<p className="text-sm ">{instructor?.skills}</p>
							<p className="text-sm ">
								{instructor?.country}, {instructor?.city}
							</p>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
