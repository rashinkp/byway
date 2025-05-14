// components/ui/Loading.tsx
"use client";

import React from "react";
import { useLoading } from "@/lib/context/LoadingContext";

export function Loading() {
  const { isLoading } = useLoading();

  if (process.env.NODE_ENV === "development") {
    console.log("Loading component: isLoading =", isLoading);
  }

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
        <p className="text-gray-700 font-medium">Loading...</p>
      </div>
    </div>
  );
}
