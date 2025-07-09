import MainCourseListing from "@/components/course/MainCourseListing";
import { Suspense } from "react";



export default function Page() {
	return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainCourseListing />
    </Suspense>
  );
}
