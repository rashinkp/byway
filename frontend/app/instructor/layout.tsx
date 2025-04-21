import InstructorLayout from "@/components/instructor/InstructorLayout";

export default function InstructorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InstructorLayout>{children}</InstructorLayout>;
}
