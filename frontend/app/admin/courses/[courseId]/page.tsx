
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import MainAdminCourseDetails from "@/components/course/admin/MainCourseDetails";
import { Suspense } from "react";




export default function CourseDetail() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<MainAdminCourseDetails />
		</Suspense>
	);
}