import MainCourseDetailsContent from "@/components/course/course-detail/MainCourseDetailContent";
import { Suspense } from "react";

export default function CourseDetail() {

	return (
		 <Suspense fallback={<div>Loading...</div>}>
					<MainCourseDetailsContent /> 
				</Suspense>
	);
}
