import MainAdminCourseDetails from "@/components/course/admin/MainCourseDetails";
import { Suspense } from "react";




export default function CourseDetail() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<MainAdminCourseDetails />
		</Suspense>
	);
}