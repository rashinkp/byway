import MainLessonDetail from "@/components/lesson/detail/MainLessonDetail";
import { Suspense } from "react";



export default function InstructorLessonDetailPage() {
	return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainLessonDetail />
    </Suspense>
  );
}