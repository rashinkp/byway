import { LoadingSpinner } from "@/components/admin";
import MainCourseDetails from "@/components/course/instructor/MainCourseDetail";
import { Suspense } from "react";

export default function InstructorCourseDetailPage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<MainCourseDetails />
		</Suspense>
	)
}