import { FormFieldConfig } from "@/components/ui/FormModal";
import z from "zod";

export const profileSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods")
    .regex(/^[a-zA-Z]/, "Name must start with a letter")
    .regex(/[a-zA-Z]$/, "Name must end with a letter")
    .refine((name) => !/\s{2,}/.test(name), "Name cannot contain consecutive spaces")
    .refine((name) => !/^[^a-zA-Z]*$/.test(name), "Name must contain at least one letter"),
  avatar: z
    .union([
      z.instanceof(File),
      z.string(),
    ])
    .optional(),
  bio: z.string()
    .max(500, "Bio must be less than 500 characters")
    .refine((val) => !val || /^[\w\s\.,!?;:'"()-]+$/.test(val), "Bio contains invalid characters")
    .optional(),
  education: z
    .string()
    .max(200, "Education must be less than 200 characters")
    .refine((val) => !val || /^[a-zA-Z\s\.,\-'()]+$/.test(val), "Education contains invalid characters")
    .optional(),
  skills: z
    .string()
    .max(200, "Skills must be less than 200 characters")
    .refine((val) => !val || /^[a-zA-Z0-9+\-#\s,]+$/.test(val), "Skills can only contain letters, numbers, +, -, #, spaces, and commas")
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s-()]{10,15}$/, "Invalid phone number format")
    .refine((val) => !val || /^\d{10,15}$/.test(val.replace(/[\s\-()]/g, '')), "Phone number must contain 10-15 digits")
    .optional(),
  country: z
    .string()
    .max(100, "Country must be less than 100 characters")
    .refine((val) => !val || /^[a-zA-Z\s\-']+$/.test(val), "Country can only contain letters, spaces, hyphens, and apostrophes")
    .optional(),
  city: z.string()
    .max(100, "City must be less than 100 characters")
    .refine((val) => !val || /^[a-zA-Z\s\-']+$/.test(val), "City can only contain letters, spaces, hyphens, and apostrophes")
    .optional(),
  address: z
    .string()
    .max(200, "Address must be less than 200 characters")
    .refine((val) => !val || /^[\w\s\.,\-'#]+$/.test(val), "Address contains invalid characters")
    .optional(),
  dateOfBirth: z.coerce
    .date()
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
      },
      {
        message: "Date of birth must be in the past",
      },
    )
    .transform((date) => date.toISOString())
    .optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});
// Form field configurations (skills switched to multiselect)
export const formFields: FormFieldConfig<z.infer<typeof profileSchema>>[] = [
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
    showPreview: false,
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
    type: "multiselect",
    placeholder: "Select skills",
    description: "Pick your professional skills",
    options: [
      { value: "JavaScript", label: "JavaScript" },
      { value: "TypeScript", label: "TypeScript" },
      { value: "React", label: "React" },
      { value: "Next.js", label: "Next.js" },
      { value: "Node.js", label: "Node.js" },
      { value: "Express", label: "Express" },
      { value: "MongoDB", label: "MongoDB" },
      { value: "PostgreSQL", label: "PostgreSQL" },
      { value: "Python", label: "Python" },
      { value: "Django", label: "Django" },
      { value: "Java", label: "Java" },
      { value: "Spring", label: "Spring" },
      { value: "AWS", label: "AWS" },
      { value: "Docker", label: "Docker" },
      { value: "Kubernetes", label: "Kubernetes" },
      { value: "TailwindCSS", label: "TailwindCSS" },
      { value: "Git", label: "Git" },
    ],
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
    type: "select",
    options: [
      { value: "India", label: "India" },
      { value: "United States", label: "United States" },
      { value: "United Kingdom", label: "United Kingdom" },
      { value: "Canada", label: "Canada" },
      { value: "Australia", label: "Australia" },
      { value: "Germany", label: "Germany" },
      { value: "France", label: "France" },
      { value: "China", label: "China" },
      { value: "Japan", label: "Japan" },
      { value: "Brazil", label: "Brazil" },
    ],
    placeholder: "Select your country",
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
