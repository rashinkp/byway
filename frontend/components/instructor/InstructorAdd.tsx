"use client";

import { z } from "zod";
import { FormModal, FormFieldConfig } from "@/components/ui/FormModal";
import { Path } from "react-hook-form";
import { useGetInstructorByUserId } from "@/hooks/instructor/useGetInstructorByUserId";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { useFileUpload } from "@/hooks/file/useFileUpload";

export const instructorSchema = z.object({
  
  // Professional Information
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
  
  // Education
  education: z.string().min(1, "Education details are required"),
  
  // Certifications
  certifications: z.string().min(1, "Certifications are required"),
  
  // Documents
  cv: z.instanceof(File, { message: "CV is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine((file) => file.type === "application/pdf", "File must be a PDF"),
});

export type InstructorFormData = z.infer<typeof instructorSchema>;

export type InstructorSubmitData = Omit<InstructorFormData, 'cv'> & {
  cv: string;
};

const fields: FormFieldConfig<InstructorFormData>[] = [
  
  {
    name: "areaOfExpertise",
    label: "Area of Expertise",
    type: "input",
    fieldType: "text",
    placeholder: "e.g., Web Development, Data Science",
    description: "Your primary area of expertise",
  },
  {
    name: "professionalExperience",
    label: "Professional Experience",
    type: "textarea",
    placeholder: "Describe your professional experience",
    description: "Your work experience and achievements",
  },
  {
    name: "about",
    label: "About",
    type: "textarea",
    placeholder: "Tell us about yourself",
    description: "A brief introduction about yourself",
  },
  {
    name: "website",
    label: "Website",
    type: "input",
    fieldType: "text",
    placeholder: "https://your-website.com",
    description: "Your personal or professional website (optional)",
  },
  {
    name: "education",
    label: "Education",
    type: "textarea",
    placeholder: "List your educational qualifications",
    description: "Include your degrees, institutions, and graduation years",
  },
  {
    name: "certifications",
    label: "Certifications",
    type: "textarea",
    placeholder: "List your professional certifications",
    description: "Enter your certifications (one per line)",
  },
  {
    name: "cv",
    label: "CV/Resume",
    type: "input",
    fieldType: "file",
    description: "Upload your CV/Resume (PDF, max 5MB)",
    accept: "application/pdf",
    maxSize: 5 * 1024 * 1024,
    fileTypeLabel: "PDF",
  },
];

interface InstructorFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InstructorSubmitData) => Promise<void>;
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
    useGetInstructorByUserId(open);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { uploadFile, isUploading } = useFileUpload();

  useEffect(() => {
    if (
      instructorData?.data?.status === "DECLINED" &&
      instructorData.data.updatedAt
    ) {
      const updatedAt = new Date(instructorData.data.updatedAt);
      const now = new Date();
      const fiveMinutesInMs = 5 * 60 * 1000;
      const timeSinceUpdate = now.getTime() - updatedAt.getTime();
      const remainingTime = fiveMinutesInMs - timeSinceUpdate;

      if (remainingTime > 0) {
        setTimeLeft(Math.ceil(remainingTime / 1000));
        const interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev === null || prev <= 1) {
              clearInterval(interval);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setTimeLeft(null);
      }
    } else {
      setTimeLeft(null);
    }
  }, [instructorData]);

  const handleSubmit = async (data: InstructorFormData) => {
    try {
      // Upload the file first
      const fileUrl = await uploadFile(data.cv);

      // Submit the form with the file URL
      await onSubmit({
        ...data,
        cv: fileUrl,
      });
    } catch (error: any) {
      console.error("Error submitting form:", error);
    }
  };

  if (user?.role === "ADMIN") {
    return null;
  }

  if (instructorData?.data?.status === "PENDING") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Pending</DialogTitle>
            <DialogDescription>
              Your instructor application is currently under review. We will notify
              you once it has been processed.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (instructorData?.data?.status === "APPROVED") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Approved</DialogTitle>
            <DialogDescription>
              Your instructor application has been approved. You can now start
              creating courses.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (instructorData?.data?.status === "DECLINED") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Declined</DialogTitle>
            <DialogDescription>
              {timeLeft ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    You can submit a new application in {timeLeft} seconds.
                  </span>
                </div>
              ) : (
                "You can now submit a new application."
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      schema={instructorSchema}
      initialData={initialData}
      title="Apply as Instructor"
      submitText="Submit Application"
      fields={fields}
      description="Fill out the form below to apply as an instructor."
      isSubmitting={isSubmitting || isInstructorLoading || isUploading}
    />
  );
}
