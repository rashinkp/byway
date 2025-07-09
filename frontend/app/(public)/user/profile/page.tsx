import MainProfileComponent from "@/components/profile/MainProfileComponent";
import { Suspense } from "react";



export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainProfileComponent />
    </Suspense>
  );
}