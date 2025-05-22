// import { Header } from "@/components/layout/Header";

import { Header } from "@/components/layout/Header";
import BywayFooter from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <BywayFooter />
    </div>
  );
}
