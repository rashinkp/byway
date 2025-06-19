"use client";

// import { Header } from "@/components/layout/Header";

import { Header } from "@/components/layout/Header";
import BywayFooter from "@/components/Footer";
import { usePathname } from 'next/navigation';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <BywayFooter />
    </div>
  );
}
