	import MainInstructorDetail from "@/components/instructor/admin/MainInstructorDetail";
import { Suspense } from "react";

export default function InstructorContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainInstructorDetail />
    </Suspense>
  );
}
