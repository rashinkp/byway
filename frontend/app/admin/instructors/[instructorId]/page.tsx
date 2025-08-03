	import { LoadingSpinner } from "@/components/admin";
import MainInstructorDetail from "@/components/instructor/admin/MainInstructorDetail";
import { Suspense } from "react";

export default function InstructorContent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MainInstructorDetail />
    </Suspense>
  );
}
