"use client";

import { z } from "zod";
import { FormModal } from "@/components/ui/FormModal";
import { Path } from "react-hook-form";
import { useGetInstructorByUserId } from "@/hooks/instructor/useGetInstructorByUserId";
import { useAuthStore } from "@/stores/auth.store";

export const instructorSchema = z.object({
  areaOfExpertise: z
    .string()
    .min(1, "Area of expertise is required")
    .max(100, "Area of expertise is too long"),
  professionalExperience: z
    .string()
    .min(1, "Professional experience is required")
    .max(500, "Professional experience is too long"),
  about: z.string().max(1000, "About section is too long").optional(),
  website: z
    .string()
    .url("Invalid URL format")
    .max(200, "Website URL is too long")
    .optional(),
});

export type InstructorFormData = z.infer<typeof instructorSchema>;

// Define fields outside the component to ensure stability
const fields: {
  name: Path<InstructorFormData>;
  label: string;
  type: "input" | "textarea";
  fieldType?: "text" | "number" | "file" | "date";
  placeholder: string;
  description?: string;
  maxLength?: number;
}[] = [
  {
    name: "areaOfExpertise",
    label: "Area of Expertise",
    type: "input",
    fieldType: "text",
    placeholder: "e.g., Web Development",
    description: "Specify your primary area of expertise.",
    maxLength: 100,
  },
  {
    name: "professionalExperience",
    label: "Professional Experience",
    type: "textarea",
    placeholder: "e.g., 10+ years as a Full-Stack Developer",
    description: "Describe your professional background.",
    maxLength: 500,
  },
  {
    name: "about",
    label: "About",
    type: "textarea",
    placeholder: "e.g., Experienced developer in MERN stack",
    description: "Provide a brief bio (optional).",
    maxLength: 1000,
  },
];

interface InstructorFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InstructorFormData) => Promise<void>;
  initialData?: Partial<InstructorFormData>;
  isSubmitting?: boolean;
}

export function InstructorFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting,
}: InstructorFormModalProps) {
  const { user } = useAuthStore();
  const { data: instructorData, isLoading: isInstructorLoading } =
    useGetInstructorByUserId();

  const renderContent = () => {
    if (isInstructorLoading) {
      return <div className="text-center py-4">Loading...</div>;
    }

    if (instructorData?.data) {
      const status = instructorData.data.status;
      if (status === "PENDING") {
        return (
          <div className="text-center py-4">
            <p className="text-gray-700">
              Your instructor application is pending verification.
            </p>
            <p className="text-gray-500 mt-2">
              If you have questions, please contact{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:underline"
              >
                support@example.com
              </a>
              .
            </p>
          </div>
        );
      } else if (status === "APPROVED") {
        return (
          <div className="text-center py-4">
            <p className="text-gray-700">
              You are already an approved instructor.
            </p>
          </div>
        );
      } else if (status === "DECLINED") {
        return (
          <FormModal
            open={open}
            onOpenChange={onOpenChange}
            onSubmit={onSubmit}
            schema={instructorSchema}
            initialData={initialData}
            title="Reapply as Instructor"
            submitText="Reapply"
            fields={fields}
            description="Your previous application was declined. Update your details and reapply."
            isSubmitting={isSubmitting}
          />
        );
      }
    }

    // Show form if no application exists
    return (
      <FormModal
        open={open}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        schema={instructorSchema}
        initialData={initialData}
        title="Become an Instructor"
        submitText="Apply"
        fields={fields}
        description="Apply to become an instructor by filling out your details."
        isSubmitting={isSubmitting}
      />
    );
  };

  // Only render modal if user is not an admin
  if (user?.role === "ADMIN") {
    return null;
  }

  return <div>{renderContent()}</div>;
}
