// // src/components/lesson/LessonContentFormModal.tsx
// "use client";

// import { z } from "zod";
// import { toast } from "sonner";
// import { FormModal, FormFieldConfig } from "../ui/FormModal";
// import { LessonContentFormData } from "@/types/lesson";

// // Zod schema for LessonContent
// export const lessonContentSchema = z.object({
//   type: z.enum(["VIDEO", "QUIZ", "TEXT"], {
//     message: "Content type is required",
//   }),
//   status: z.enum(["DRAFT", "PUBLISHED"], { message: "Status is required" }),
//   data: z
//     .object({
//       videoUrl: z.string().url("Invalid URL format").optional(),
//       questions: z
//         .array(
//           z.object({
//             question: z.string().min(1, "Question is required"),
//             options: z
//               .array(z.string())
//               .min(2, "At least two options required"),
//             answer: z.string().min(1, "Answer is required"),
//           })
//         )
//         .optional(),
//       text: z.string().optional(),
//     })
//     .refine(
//       (data) => {
//         if (data.type === "VIDEO") return !!data.videoUrl;
//         if (data.type === "QUIZ")
//           return data.questions && data.questions.length > 0;
//         if (data.type === "TEXT") return !!data.text;
//         return true;
//       },
//       { message: "Content data is required for the selected type" }
//     ),
// });

// export const lessonContentFields: FormFieldConfig<LessonContentFormData>[] = [
//   {
//     name: "type",
//     label: "Content Type",
//     type: "select",
//     placeholder: "Select content type",
//     description: "Choose the type of content for this lesson.",
//     options: [
//       { value: "VIDEO", label: "Video" },
//       { value: "QUIZ", label: "Quiz" },
//       { value: "TEXT", label: "Text" },
//     ],
//     column: "left",
//   },
//   {
//     name: "status",
//     label: "Status",
//     type: "select",
//     placeholder: "Select status",
//     description: "Choose the publication status of the content.",
//     options: [
//       { value: "DRAFT", label: "Draft" },
//       { value: "PUBLISHED", label: "Published" },
//     ],
//     column: "right",
//   },
//   {
//     name: "data.videoUrl",
//     label: "Video URL",
//     type: "input",
//     fieldType: "text",
//     placeholder: "e.g., https://example.com/video.mp4",
//     description:
//       "Provide the URL for the video content (required for Video type).",
//     maxLength: 200,
//     column: "left",
//     showWhen: (data) => data.type === "VIDEO",
//   },
//   {
//     name: "data.text",
//     label: "Text Content",
//     type: "textarea",
//     placeholder: "Enter text content",
//     description: "Provide the text content (required for Text type).",
//     maxLength: 5000,
//     column: "right",
//     showWhen: (data) => data.type === "TEXT",
//   },
//   // Note: Quiz questions require a custom field or sub-form (simplified here)
//   {
//     name: "data.questions",
//     label: "Quiz Questions",
//     type: "custom",
//     description: "Add questions for the quiz (required for Quiz type).",
//     column: "full",
//     showWhen: (data) => data.type === "QUIZ",
//     // Custom rendering for quiz questions (placeholder)
//     render: () => (
//       <div>
//         <p className="text-sm text-gray-500">
//           Quiz questions (custom implementation needed)
//         </p>
//         {/* Add dynamic form for questions, options, and answers */}
//       </div>
//     ),
//   },
// ];

// interface LessonContentFormModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSubmit: (data: LessonContentFormData) => Promise<void>;
//   initialData?: Partial<LessonContentFormData>;
//   isSubmitting?: boolean;
// }

// export function LessonContentFormModal({
//   open,
//   onOpenChange,
//   onSubmit,
//   initialData,
//   isSubmitting,
// }: LessonContentFormModalProps) {
//   const handleSubmit = async (data: LessonContentFormData) => {
//     try {
//       await onSubmit(data);
//       onOpenChange(false);
//       toast.success(
//         initialData
//           ? "Content updated successfully"
//           : "Content created successfully"
//       );
//     } catch (err) {
//       toast.error(
//         err instanceof Error ? err.message : "Failed to save content"
//       );
//     }
//   };

//   return (
//     <FormModal
//       open={open}
//       onOpenChange={onOpenChange}
//       onSubmit={handleSubmit}
//       schema={lessonContentSchema}
//       initialData={initialData}
//       title={initialData ? "Edit Content" : "Add Content"}
//       submitText="Save"
//       fields={lessonContentFields}
//       description={
//         initialData
//           ? "Update the lesson content details."
//           : "Add new content to the lesson."
//       }
//       isSubmitting={isSubmitting}
//     />
//   );
// }
