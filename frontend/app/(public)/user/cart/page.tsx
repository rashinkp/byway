import { LoadingSpinner } from "@/components/admin";
import MainCartComponent from "@/components/cart/MainCartComponent";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MainCartComponent />
    </Suspense>
  );
}