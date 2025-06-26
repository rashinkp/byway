"use client";

import { useState } from "react";
import { z } from "zod";
import { FormFieldConfig, FormModal } from "@/components/ui/FormModal";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";
import { getPresignedUrl, uploadFileToS3 } from "@/api/file";
import { User, UserProfileType } from "@/types/user";

// Zod schema for profile validation (unchanged)
const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Name cannot be only white spaces",
    }),
  avatar: z
    .union([
      z.instanceof(File), // Allow File objects
      z.string().url("Invalid URL").optional(), // Allow valid URLs or empty
      z.literal(""), // Allow empty string
    ])
    .optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  education: z
    .string()
    .max(200, "Education must be less than 200 characters")
    .optional(),
  skills: z
    .string()
    .max(200, "Skills must be less than 200 characters")
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s-]{10,15}$/, "Invalid phone number")
    .optional(),
  country: z
    .string()
    .max(100, "Country must be less than 100 characters")
    .optional(),
  city: z.string().max(100, "City must be less than 100 characters").optional(),
  address: z
    .string()
    .max(200, "Address must be less than 200 characters")
    .optional(),
  dateOfBirth: z.coerce
    .date()
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
        return date < today;
      },
      {
        message: "Date of birth must be in the past",
      }
    )
    .transform((date) => date.toISOString())
    .optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});
// Form field configurations (unchanged)
const formFields: FormFieldConfig<z.infer<typeof profileSchema>>[] = [
  {
    name: "name",
    label: "Full Name",
    type: "input",
    fieldType: "text",
    placeholder: "Enter your full name",
    description: "Your full name as you want it displayed",
  },
  {
    name: "avatar",
    label: "Profile Picture",
    type: "input",
    fieldType: "file",
    accept: "image/*",
    maxSize: 5 * 1024 * 1024,
    fileTypeLabel: "image",
    description: "Upload a profile picture (max 5MB)",
  },
  {
    name: "bio",
    label: "Bio",
    type: "textarea",
    placeholder: "Tell us about yourself",
    description: "A brief description about yourself (max 500 characters)",
  },
  {
    name: "education",
    label: "Education",
    type: "input",
    fieldType: "text",
    placeholder: "Your educational background",
    description: "Your highest degree or current education",
  },
  {
    name: "skills",
    label: "Skills",
    type: "input",
    fieldType: "text",
    placeholder: "Comma-separated skills",
    description: "List your professional skills (e.g., JavaScript, Python)",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "input",
    fieldType: "text",
    placeholder: "+1234567890",
    description: "Your contact phone number",
  },
  {
    name: "country",
    label: "Country",
    type: "input",
    fieldType: "text",
    placeholder: "Your country",
  },
  {
    name: "city",
    label: "City",
    type: "input",
    fieldType: "text",
    placeholder: "Your city",
  },
  {
    name: "address",
    label: "Address",
    type: "input",
    fieldType: "text",
    placeholder: "Your address",
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "input",
    fieldType: "date",
    placeholder: "YYYY-MM-DD",
    description: "Your date of birth",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: [
      { value: "MALE", label: "Male" },
      { value: "FEMALE", label: "Female" },
      { value: "OTHER", label: "Other" },
    ],
    placeholder: "Select gender",
  },
];


interface EditProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfileType | undefined;
  isInstructor?: boolean;
}

export default function EditProfileForm({
  open,
  onOpenChange,
  user,
  isInstructor = false,
}: EditProfileFormProps) {
  const { mutate: updateUser, isLoading: isUpdating } = useUpdateUser();

  const handleSubmit = async (data: z.infer<typeof profileSchema>) => {
    let avatarUrl: string | undefined;

    // If avatar is a File, upload to S3
    if (data.avatar instanceof File) {
      try {
        const { uploadUrl, fileUrl } = await getPresignedUrl(data.avatar.name, data.avatar.type);
        await uploadFileToS3(data.avatar, uploadUrl);
        avatarUrl = fileUrl; // Set the S3 URL
      } catch (error) {
        console.error("Failed to upload avatar to S3:", error);
        throw new Error("Failed to upload profile picture");
      }
    } else {
      // If avatar is a string (URL or empty), use it directly
      avatarUrl = typeof data.avatar === "string" ? data.avatar : undefined;
    }

    const transformedData = {
      ...data,
      avatar: avatarUrl, // Ensure avatar is string | undefined
      skills: typeof data.skills === "string" && data.skills
        ? data.skills
            .split(",")
            .map((s: string) => s.trim())
            .join(", ")
        : undefined,
    };

    updateUser(transformedData);
    onOpenChange(false);
  };

  // Prepare initial form data from user object
  const initialData = user
    ? {
        name: user.name || "",
        avatar: user.avatar || "",
        bio: user?.bio || "",
        education: user?.education || "",
        skills: Array.isArray(user?.skills)
          ? user.skills.join(", ")
          : user?.skills || "",
        phoneNumber: user?.phoneNumber || "",
        country: user?.country || "",
        city: user?.city || "",
        address: user?.address || "",
        dateOfBirth: user?.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : undefined,
        gender: user?.gender || undefined,
      }
    : undefined;

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      schema={profileSchema}
      initialData={initialData}
      title="Edit Profile"
      submitText="Save Changes"
      fields={formFields}
      description="Update your profile information below."
      isSubmitting={isUpdating}
    />
  );
}
