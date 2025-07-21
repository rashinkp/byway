import MainProfileComponent from "@/components/profile/MainProfileComponent";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="bg-white  min-h-screen p-0">
      <Suspense fallback={<div>Loading...</div>}>
        <MainProfileComponent />
      </Suspense>
    </div>
  );
}