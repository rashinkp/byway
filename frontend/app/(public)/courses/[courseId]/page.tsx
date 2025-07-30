import { LoadingSpinner } from "@/components/admin";
import MainCourseDetailsContent from "@/components/course/course-detail/MainCourseDetailContent";
import { Suspense } from "react";

export default function CourseDetail() {

	return (
		 <Suspense fallback={<LoadingSpinner />}>
					<MainCourseDetailsContent /> 
				</Suspense>
	);
}
