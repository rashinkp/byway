"use client";

import { useState } from "react";
import {
  ContentType,
  ContentStatus,
  CreateLessonContentInput,
  UpdateLessonContentInput,
  LessonContent,
} from "@/types/content";
import { useCreateContent } from "@/hooks/content/useCreateContent";
import { useUpdateContent } from "@/hooks/content/useUpdateContent";
import { validateForm } from "./ContentValidation";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { TitleInput } from "./ContentTitleInput";
import { DescriptionInput } from "./ContentDescriptionInput";
import { QuizInput } from "./ContentQuizInput";
import { ThumbnailUploadInput } from "./ContentThumbnailInputSection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { FileUploadInput } from "./ContentFileUploadInput";

//todo: when editing content and all make sure the status update

interface ContentInputFormProps {
  lessonId: string;
  initialData?: LessonContent | null;
  onSuccess?: () => void;
}

export const ContentInputForm = ({
  lessonId,
  initialData,
  onSuccess,
}: ContentInputFormProps) => {
  const [type, setType] = useState<ContentType>(
    initialData?.type || ContentType.VIDEO
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState(initialData?.fileUrl || "");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnailUrl || ""
  );
  const [questions, setQuestions] = useState<
    { question: string; options: string[]; correctAnswer: string }[]
  >(initialData?.quizQuestions || []);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailUploadStatus, setThumbnailUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [errors, setErrors] = useState<{
    title?: string;
    file?: string;
    thumbnail?: string;
    questions?: string;
    newQuestion?: string;
    newOptions?: string;
    newAnswer?: string;
  }>({});

  const { mutate: createContent, isPending: isCreating } = useCreateContent();
  const { mutate: updateContent, isPending: isUpdating } = useUpdateContent();

  const isUploading =
    uploadStatus === "uploading" || thumbnailUploadStatus === "uploading";
  const isSubmitting = isCreating || isUpdating || isUploading;

  const isEditing = !!initialData?.id;
  const isTypeChanged = isEditing && type !== initialData?.type;
  const isFileChanged =
    isEditing &&
    file !== null &&
    (type === ContentType.VIDEO || type === ContentType.DOCUMENT);
  const showAlert = isEditing && (isTypeChanged || isFileChanged);

  const handleCancel = () => {
    setType(initialData?.type || ContentType.VIDEO);
    setTitle(initialData?.title || "");
    setDescription(initialData?.description || "");
    setFile(null);
    setFileUrl(initialData?.fileUrl || "");
    setThumbnail(null);
    setThumbnailUrl(initialData?.thumbnailUrl || "");
    setQuestions(initialData?.quizQuestions || []);
    setUploadStatus("idle");
    setUploadProgress(0);
    setThumbnailUploadStatus("idle");
    setThumbnailUploadProgress(0);
    setErrors({});
    onSuccess?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !validateForm(
        type,
        title,
        file,
        fileUrl,
        thumbnail,
        thumbnailUrl,
        questions,
        setErrors
      )
    )
      return;

    let finalFileUrl = fileUrl;
    let finalThumbnailUrl = thumbnailUrl;
    if (file) {
      try {
        finalFileUrl = await (FileUploadInput as any).uploadToS3(
          file
        );
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          file: "Failed to upload file",
        }));
        return;
      }
    }
    if (thumbnail && type === ContentType.VIDEO) {
      try {
        finalThumbnailUrl = await (ThumbnailUploadInput as any).uploadToS3(
          thumbnail
        );
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          thumbnail: "Failed to upload thumbnail",
        }));
        return;
      }
    }

    const data: CreateLessonContentInput = {
      lessonId,
      type,
      status:
        finalFileUrl || questions.length > 0
          ? ContentStatus.PUBLISHED
          : ContentStatus.DRAFT,
      title,
      description: description || undefined,
      fileUrl: type !== ContentType.QUIZ ? finalFileUrl : undefined,
      thumbnailUrl: type === ContentType.VIDEO ? finalThumbnailUrl : undefined,
      quizQuestions: type === ContentType.QUIZ ? questions : undefined,
    };

    if (initialData?.id) {
      const updateData: UpdateLessonContentInput = {
        id: initialData.id,
        lessonId,
        type: data.type,
        status: data.status,
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        thumbnailUrl: data.thumbnailUrl,
        quizQuestions: data.quizQuestions,
      };
      updateContent(updateData, {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (error) => setErrors({ title: error.message }),
      });
    } else {
      createContent(data, {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (error) => setErrors({ title: error.message }),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
          {isEditing ? "Edit Content" : "Create Content"}
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-indigo-700 mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isEditing ? (
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content Type
            </label>
            <div className="p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-700">
              {type}
            </div>
          </div>
        ) : (
          <ContentTypeSelector type={type} setType={setType} />
        )}
        <TitleInput title={title} setTitle={setTitle} errors={errors} />
      </div>

      <DescriptionInput
        description={description}
        setDescription={setDescription}
      />

      {(type === ContentType.VIDEO || type === ContentType.DOCUMENT) && (
        <FileUploadInput
          type={type}
          file={file}
          setFile={setFile}
          fileUrl={fileUrl}
          setFileUrl={setFileUrl}
          setUploadStatus={setUploadStatus}
          setUploadProgress={setUploadProgress}
          uploadStatus={uploadStatus}
          uploadProgress={uploadProgress}
          errors={errors}
        />
      )}

      {type === ContentType.VIDEO && (
        <ThumbnailUploadInput
          file={thumbnail}
          setFile={setThumbnail}
          fileUrl={thumbnailUrl}
          setFileUrl={setThumbnailUrl}
          uploadStatus={thumbnailUploadStatus}
          uploadProgress={thumbnailUploadProgress}
          errors={errors}
          setUploadProgress={setThumbnailUploadProgress}
          setUploadStatus={setThumbnailUploadStatus}
        />
      )}

      {type === ContentType.QUIZ && (
        <QuizInput
          questions={questions}
          setQuestions={setQuestions}
          errors={errors}
          setErrors={(quizErrors) =>
            setErrors((prev) => ({ ...prev, ...quizErrors }))
          }
        />
      )}

      {showAlert && (
        <Alert
          variant="destructive"
          className="bg-red-50 border border-red-200 rounded-xl"
        >
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <AlertTitle className="text-red-600 font-medium">
            Warning: Potential Data Loss
          </AlertTitle>
          <AlertDescription className="text-red-500">
            {isTypeChanged && isFileChanged
              ? "Changing the content type or updating the file may cause data loss (e.g., existing files or quiz questions). You will need to re-upload any new files."
              : isTypeChanged
              ? "Changing the content type may cause data loss (e.g., existing files or quiz questions). You will need to re-upload any new files."
              : "Updating the file will replace the existing file. You will need to re-upload the new file."}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex space-x-6 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Submit"
          )}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
