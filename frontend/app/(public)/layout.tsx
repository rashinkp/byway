// import { Header } from "@/components/layout/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      {/* <Header /> */}
      <main className="flex-grow container">{children}</main>
    </div>
  );
}
