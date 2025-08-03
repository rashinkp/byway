import { LoadingSpinner } from "@/components/admin";
import MainCourseListing from "@/components/course/MainCourseListing";
import { Suspense } from "react";



export default function Page() {
	return (
    <Suspense fallback={<LoadingSpinner />}>
      <MainCourseListing />
    </Suspense>
  );
}
