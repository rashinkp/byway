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
}: {
  course?: Course;
  isEditing: boolean;
  form: any;
}) => {
  const { register, formState, control } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Title</h3>
          {isEditing ? (
            <Input
              {...register("title")}
              className="mt-1"
              placeholder="Course title"
              disabled={formState.isSubmitting}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              {course?.title || "Not available"}
            </p>
          )}
          {formState.errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.title.message}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Id</h3>
          <p className="mt-1 text-gray-900 font-medium">
            {course?.id || "Not available"}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Level</h3>
          {isEditing ? (
            <Select
              onValueChange={(value) =>
                form.setValue(
                  "level",
                  value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
                )
              }
              defaultValue={
                course?.level === "MEDIUM" ? "INTERMEDIATE" : course?.level
              }
              disabled={formState.isSubmitting}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              {course?.level
                ? (course.level === "MEDIUM" ? "INTERMEDIATE" : course.level)
                    .charAt(0)
                    .toUpperCase() +
                  (course.level === "MEDIUM" ? "INTERMEDIATE" : course.level)
                    .slice(1)
                    .toLowerCase()
                : "Not available"}
            </p>
          )}
          {formState.errors.level && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.level.message}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Price</h3>
          {isEditing ? (
            <Input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="mt-1 w-32"
              placeholder="Price"
              disabled={formState.isSubmitting}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              ${course?.price?.toFixed(2) || "0.00"}
            </p>
          )}
          {formState.errors.price && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.price.message}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Offer Price</h3>
          {isEditing ? (
            <Input
              type="number"
              step="0.01"
              {...register("offer", { valueAsNumber: true })}
              className="mt-1 w-32"
              placeholder="Offer Price"
              disabled={formState.isSubmitting}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              $
              {course?.offer?.toFixed(2) || course?.price?.toFixed(2) || "0.00"}
            </p>
          )}
          {formState.errors.offer && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.offer.message}
            </p>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Duration</h3>
          {isEditing ? (
            <Input
              type="number"
              {...register("duration", { valueAsNumber: true })}
              className="mt-1 w-32"
              placeholder="Duration (minutes)"
              disabled={formState.isSubmitting}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              {course?.duration
                ? `${course.duration} minutes`
                : "Not available"}
            </p>
          )}
          {formState.errors.duration && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.duration.message}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Status</h3>
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
            <p className="mt-1 font-medium">
              {course?.status === "DRAFT" ? (
                <span className="text-gray-900">Draft</span>
              ) : course?.status === "PUBLISHED" ? (
                <span className="text-green-600">Published</span>
              ) : course?.status === "ARCHIVED" ? (
                <span className="text-red-600">Archived</span>
              ) : (
                "Not available"
              )}
            </p>
          )}
          {formState.errors.status && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.status.message}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Active</h3>
          <StatusBadge isActive={!course?.deletedAt} className="mt-1" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Created At</h3>
          <p className="mt-1 text-gray-900 font-medium">
            {formatDate(course?.createdAt || null) || "Not available"}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Updated At</h3>
          <p className="mt-1 text-gray-900 font-medium">
            {formatDate(course?.updatedAt || null) || "Not updated yet"}
          </p>
        </div>
      </div>
    </div>
  );
};
