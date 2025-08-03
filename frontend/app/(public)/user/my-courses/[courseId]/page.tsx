
import { LoadingSpinner } from "@/components/admin";
import MainContentSection from "@/components/content/Main";
import { Suspense } from "react";


export default function CourseContent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MainContentSection />
    </Suspense>
  ); 
}