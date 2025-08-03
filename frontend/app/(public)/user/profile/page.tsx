import { LoadingSpinner } from "@/components/admin";
import MainProfileComponent from "@/components/profile/MainProfileComponent";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="bg-white  min-h-screen p-0">
      <Suspense fallback={<LoadingSpinner />}>
        <MainProfileComponent />
      </Suspense>
    </div>
  );
}