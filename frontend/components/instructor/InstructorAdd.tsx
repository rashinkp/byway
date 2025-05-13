"use client";

import { z } from "zod";
import { FormModal } from "@/components/ui/FormModal";
import { Path } from "react-hook-form";

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
    fieldType: "text", // Add this
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
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      schema={instructorSchema}
      initialData={initialData}
      title={initialData ? "Edit Instructor Profile" : "Become an Instructor"}
      submitText="Save"
      fields={fields}
      description={
        initialData
          ? "Update your instructor profile details."
          : "Apply to become an instructor by filling out your details."
      }
      isSubmitting={isSubmitting}
    />
  );
}
