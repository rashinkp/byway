import { BookOpen, Clock, Users, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Course } from "@/types/cart";

interface OrderDetailsProps {
  courseDetails: Course[];
}

export default function OrderDetails({ courseDetails }: OrderDetailsProps) {
  const formatPrice = (price: number | string | undefined) => {
    if (!price) return "0.00";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[var(--color-primary-dark)] mb-4">
        <BookOpen className="w-5 h-5 text-[var(--color-primary-light)]" />
        <h2 className="text-lg font-semibold">Order Details</h2>
      </div>
      <Separator />
      <div className="space-y-6">
        {courseDetails.map((course) => (
          <div key={course.id} className="flex gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-[var(--color-background)]">
              <img
                src={course.thumbnail || "/placeholder-course.jpg"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--color-primary-dark)]">{course.title}</h3>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.lectures || 0} lectures</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>{course.level || "All Levels"}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-semibold text-[var(--color-primary-light)]">
                  ${formatPrice(course.offer || course.price)}
                </span>
                {course.offer && (
                  <span className="text-sm text-[var(--color-muted)] line-through">
                    ${formatPrice(course.price)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
