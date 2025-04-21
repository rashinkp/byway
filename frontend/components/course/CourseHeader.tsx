import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CourseHeaderProps {
  title: string;
}

export default function CourseHeader({ title }: CourseHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <Button
        onClick={() => router.push("/instructor/courses")}
        variant="outline"
        className="border-gray-300 hover:bg-gray-100"
      >
        Back to Courses
      </Button>
    </div>
  );
}