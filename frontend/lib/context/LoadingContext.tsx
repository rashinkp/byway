// lib/context/LoadingContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface LoadingContextType {
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType>({ isLoading: false });

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "Navigation detected: pathname =",
        pathname,
        "searchParams =",
        searchParams?.toString()
      );
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
      if (process.env.NODE_ENV === "development") {
        console.log("Loading state reset for pathname =", pathname);
      }
    }, 500); // Increased to 500ms for visibility

    return () => {
      clearTimeout(timer);
      if (process.env.NODE_ENV === "development") {
        console.log("Cleanup for pathname =", pathname);
      }
    };
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
