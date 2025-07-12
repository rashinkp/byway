
import MainContentSection from "@/components/content/Main";
import { Suspense } from "react";


export default function CourseContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainContentSection />
    </Suspense>
  ); 
}