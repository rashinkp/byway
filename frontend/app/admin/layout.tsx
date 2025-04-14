import { useAuthStore } from "@/lib/stores/authStore";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Client-side check (middleware handles server-side)
  if (typeof window !== "undefined") {
    const role = useAuthStore.getState().user?.role;
    if (role !== "ADMIN") {
      redirect("/login");
    }
  }

  return <div className="container mx-auto p-4">{children}</div>;
}
