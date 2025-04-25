import { Course } from "@/types/course";
import { Textarea } from "../ui/textarea";

export const OverviewSection = ({
  course,
  isEditing,
  form,
}: {
  course?: Course;
  isEditing: boolean;
  form: any;
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-gray-900">Course Overview</h2>
    {isEditing ? (
      <Textarea
        {...form.register("description")}
        className="mt-1 min-h-[100px]"
        placeholder="Course description"
        disabled={form.formState.isSubmitting}
      />
    ) : (
      <p className="text-gray-600 leading-relaxed">
        {course?.description || "No description available."}
      </p>
    )}
  </div>
);
