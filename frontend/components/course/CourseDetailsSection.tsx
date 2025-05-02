import { formatDate } from "@/utils/formatDate";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course } from "@/types/course";
import { StatusBadge } from "../ui/StatusBadge";

export const DetailsSection = ({
  course,
  isEditing,
  form,
  onImageUpload,
  uploadProgress,
}: {
  course?: Course;
  isEditing: boolean;
  form: any;
  onImageUpload?: (file: File) => void;
  uploadProgress: number | null;
}) => {
  const { register, formState } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">Title</h3>
          {isEditing ? (
            <Input
              {...register("title")}
              className="mt-1"
              placeholder="Course title"
              disabled={formState.isSubmitting}
            />
          ) : (
            <p className="mt-1 text-gray-900">
              {course?.title || "Not available"}
            </p>
          )}
          {formState.errors.title && (
            <p className="text-red-500 text-xs mt-1">
              {formState.errors.title.message}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">Level</h3>
          {isEditing ? (
            <Select
              onValueChange={(value) =>
                form.setValue(
                  "level",
                  value as "BEGINNER" | "MEDIUM" | "ADVANCED"
                )
              }
              defaultValue={course?.level}
              disabled={formState.isSubmitting}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="mt-1 text-gray-900">
              {course?.level
                ? course.level.charAt(0) + course.level.slice(1).toLowerCase()
                : "Not available"}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">Price</h3>
          {isEditing ? (
            <Input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="mt-1 w-24"
              placeholder="Price"
              disabled={formState.isSubmitting}
            />
          ) : (
            <p className="mt-1 text-gray-900">
              ${course?.price?.toFixed(2) || "0.00"}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">Duration</h3>
          {isEditing ? (
            <Input
              type="number"
              {...register("duration", { valueAsNumber: true })}
              className="mt-1 w-24"
              placeholder="Minutes"
              disabled={formState.isSubmitting}
            />
          ) : (
            <p className="mt-1 text-gray-900">
              {course?.duration
                ? `${course.duration} minutes`
                : "Not available"}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">Status</h3>
          {isEditing ? (
            <Select
              onValueChange={(value) => form.setValue("status", value)}
              defaultValue={course?.status}
              disabled={formState.isSubmitting}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="mt-1 text-gray-900">
              {course?.status
                ? course.status.charAt(0) + course.status.slice(1).toLowerCase()
                : "Not available"}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">Created At</h3>
          <p className="mt-1 text-gray-900">
            {formatDate(course?.createdAt || null) || "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
};
