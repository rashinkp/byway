import MainCourseDetails from "@/components/course/instructor/MainCourseDetail";
import { Suspense } from "react";

export default function InstructorCourseDetailPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<MainCourseDetails />
		</Suspense>
	)
}