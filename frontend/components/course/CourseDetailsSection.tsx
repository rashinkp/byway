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
  course: Course;
  isEditing: boolean;
  form: any;
}) => {
  const { register, formState } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Id</h3>
          {isEditing ? (
            <Input
              {...register("id")}
              className="mt-1"
              placeholder="Course ID"
              disabled
              value={course.id}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">{course.id}</p>
          )}
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
              defaultValue={course.level}
              disabled={form.formState.isSubmitting}
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
              {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
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
              disabled={form.formState.isSubmitting}
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
              disabled={form.formState.isSubmitting}
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
              disabled={form.formState.isSubmitting}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              {course?.duration || "Not available"} minutes
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
              onValueChange={(value) =>
                form.setValue(
                  "deletedAt",
                  value === "true" ? new Date().toISOString() : null
                )
              }
              defaultValue={course.deletedAt ? "true" : "false"}
              disabled={form.formState.isSubmitting}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Active</SelectItem>
                <SelectItem value="true">Disabled</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <StatusBadge isActive={!course.deletedAt} className="mt-1" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Stage</h3>
          {isEditing ? (
            <Select
              onValueChange={(value) => form.setValue("status", value)}
              defaultValue={course.status}
              disabled={form.formState.isSubmitting}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          ) : course.status === "DRAFT" ? (
            <p className="mt-1 text-gray-900 font-medium">Draft</p>
          ) : course.status === "PUBLISHED" ? (
            <p className="mt-1 text-green-600 font-medium">Published</p>
          ) : course.status === "ARCHIVED" ? (
            <p className="mt-1 text-red-600 font-medium">Archived</p>
          ) : null}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Created At</h3>
          {isEditing ? (
            <Input
              type="text"
              {...register("createdAt")}
              className="mt-1"
              placeholder="Created At"
              disabled
              value={formatDate(course?.createdAt) || "Not available"}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              {formatDate(course?.createdAt) || "Not available"}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Updated At</h3>
          {isEditing ? (
            <Input
              type="text"
              {...register("updatedAt")}
              className="mt-1"
              placeholder="Updated At"
              disabled
              value={formatDate(course?.updatedAt) || "Not Updated yet"}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              {formatDate(course?.updatedAt) || "Not Updated yet"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};