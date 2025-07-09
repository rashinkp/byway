import MainCartComponent from "@/components/cart/MainCartComponent";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainCartComponent />
    </Suspense>
  );
}