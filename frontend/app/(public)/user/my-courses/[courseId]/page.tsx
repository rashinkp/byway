import MainCourseDetailsContent from "@/components/course/course-detail/MainCourseDetailContent";
import { Suspense } from "react";


export default function CourseContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainCourseDetailsContent />
    </Suspense>
  ); 
}