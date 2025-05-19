"use client";

import { z } from "zod";
import { FormModal } from "@/components/ui/FormModal";
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
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

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
    useGetInstructorByUserId(open);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

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
        return () => clearInterval(interval);
      } else {
        setTimeLeft(null);
      }
    } else {
      setTimeLeft(null);
    }
  }, [instructorData]);

  if (user?.role === "ADMIN") {
    return null;
  }

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderContent = () => {
    if (isInstructorLoading) {
      return (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      );
    }

    const status = instructorData?.data?.status;

    if (status === "PENDING") {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Application Pending
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Your instructor application is under review.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Your application is currently under review. We'll notify you once
              a decision is made.
            </p>
            <p className="text-gray-500">
              For questions, please contact{" "}
              <a
                href="mailto:support@byway.com"
                className="text-blue-600 hover:underline"
              >
                support@byway.com
              </a>
              .
            </p>
          </div>
        </>
      );
    }

    if (status === "APPROVED") {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Approved Instructor
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              You are already an approved instructor.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">Start creating courses now!</p>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <a href="/instructor/dashboard">Go to Instructor Dashboard</a>
            </Button>
          </div>
        </>
      );
    }

    if (status === "DECLINED" && timeLeft !== null) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Application Declined
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Your previous application was declined.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              You can reapply after the cooldown period.
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <Clock className="w-5 h-5" />
              <p>Time left to reapply: {formatTimeLeft(timeLeft)}</p>
            </div>
            <p className="text-gray-500">
              For questions, please contact{" "}
              <a
                href="mailto:support@byway.com"
                className="text-blue-600 hover:underline"
              >
                support@byway.com
              </a>
              .
            </p>
          </div>
        </>
      );
    }

    return (
      <FormModal
        open={open}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        schema={instructorSchema}
        initialData={initialData}
        title={
          status === "DECLINED"
            ? "Reapply as Instructor"
            : "Become an Instructor"
        }
        submitText={status === "DECLINED" ? "Reapply" : "Apply"}
        fields={fields}
        description={
          status === "DECLINED"
            ? "Your previous application was declined. Update your details and reapply to become an instructor."
            : "Apply to become an instructor by filling out your details."
        }
        isSubmitting={isSubmitting}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
