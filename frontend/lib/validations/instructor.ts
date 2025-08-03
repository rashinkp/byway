import { FormFieldConfig } from "@/components/ui/FormModal";
import z from "zod";

export const instructorSchema = z.object({
  // Professional Information
  areaOfExpertise: z
    .string()
    .min(2, "Area of expertise must be at least 2 characters")
    .max(100, "Area of expertise must be less than 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-,&/()]+$/,
      "Area of expertise can only contain letters, numbers, spaces, hyphens, commas, ampersands, forward slashes, and parentheses"
    )
    .refine(
      (val) => !/\s{2,}/.test(val),
      "Area of expertise cannot contain consecutive spaces"
    )
    .refine(
      (val) => !/^[^a-zA-Z0-9]*$/.test(val),
      "Area of expertise must contain at least one letter or number"
    ),
  professionalExperience: z
    .string()
    .min(10, "Professional experience must be at least 10 characters")
    .max(500, "Professional experience must be less than 500 characters")
    .refine(
      (val) => !val || /^[\w\s\.,!?;:'"()\-/]+$/.test(val),
      "Professional experience contains invalid characters"
    )
    .refine(
      (val) => !/\s{2,}/.test(val),
      "Professional experience cannot contain consecutive spaces"
    ),
  about: z
    .string()
    .max(1000, "About section must be less than 1000 characters")
    .refine(
      (val) => !val || /^[\w\s\.,!?;:'"()\-/]+$/.test(val),
      "About section contains invalid characters"
    )
    .refine(
      (val) => !val || !/\s{2,}/.test(val),
      "About section cannot contain consecutive spaces"
    )
    .optional(),
  website: z
    .string()
    .url("Invalid URL format")
    .max(200, "Website URL must be less than 200 characters")
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "Website must start with http:// or https://"
    )
    .optional(),

  education: z
    .string()
    .min(10, "Education details must be at least 10 characters")
    .max(300, "Education details must be less than 300 characters")
    .refine(
      (val) => /^[a-zA-Z0-9\s\.,\-'()/]+$/.test(val),
      "Education contains invalid characters"
    )
    .refine(
      (val) => !/\s{2,}/.test(val),
      "Education cannot contain consecutive spaces"
    ),

  certifications: z
    .string()
    .min(5, "Certifications must be at least 5 characters")
    .max(300, "Certifications must be less than 300 characters")
    .refine(
      (val) => /^[a-zA-Z0-9\s\.,\-'()/]+$/.test(val),
      "Certifications contain invalid characters"
    )
    .refine(
      (val) => !/\s{2,}/.test(val),
      "Certifications cannot contain consecutive spaces"
    ),

  // Documents
  cv: z
    .instanceof(File, { message: "CV is required" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine((file) => file.type === "application/pdf", "File must be a PDF")
    .refine(
      (file) => file.name.length <= 100,
      "File name must be less than 100 characters"
    )
    .refine(
      (file) => /^[a-zA-Z0-9\s\-_\.]+$/.test(file.name),
      "File name contains invalid characters"
    ),
});

export type InstructorFormData = z.infer<typeof instructorSchema>;

export type InstructorSubmitData = Omit<InstructorFormData, "cv"> & {
  cv: string;
};

export const fields: FormFieldConfig<InstructorFormData>[] = [
  {
    name: "areaOfExpertise",
    label: "Area of Expertise",
    type: "input",
    fieldType: "text",
    placeholder: "e.g., Web Development, Data Science, AI/ML",
    description:
      "Your primary area of expertise (letters, numbers, spaces, hyphens, commas, ampersands, forward slashes, and parentheses allowed)",
  },
  {
    name: "professionalExperience",
    label: "Professional Experience",
    type: "textarea",
    placeholder: "Describe your professional experience",
    description:
      "Your work experience and achievements (minimum 10 characters, no consecutive spaces)",
  },
  {
    name: "about",
    label: "About",
    type: "textarea",
    placeholder: "Tell us about yourself",
    description:
      "A brief introduction about yourself (optional, maximum 1000 characters)",
  },
  {
    name: "website",
    label: "Website",
    type: "input",
    fieldType: "text",
    placeholder: "https://your-website.com",
    description:
      "Your personal or professional website (optional, must start with http:// or https://)",
  },
  {
    name: "education",
    label: "Education",
    type: "textarea",
    placeholder: "List your educational qualifications",
    description:
      "Include your degrees, institutions, and graduation years (minimum 10 characters, numbers and forward slashes allowed)",
  },
  {
    name: "certifications",
    label: "Certifications",
    type: "textarea",
    placeholder: "List your professional certifications",
    description:
      "Enter your certifications (minimum 5 characters, numbers and forward slashes allowed)",
  },
  {
    name: "cv",
    label: "CV/Resume",
    type: "input",
    fieldType: "file",
    description: "Upload your CV/Resume (PDF only, max 5MB, valid filename)",
    accept: "application/pdf",
    maxSize: 5 * 1024 * 1024,
    fileTypeLabel: "PDF",
  },
];
