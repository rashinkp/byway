"use client";

import { useState } from "react";
import {
  ContentType,
  ContentStatus,
  CreateLessonContentInput,
  UpdateLessonContentInput,
} from "@/types/content";
import { useCreateContent } from "@/hooks/content/useCreateContent";
import { useUpdateContent } from "@/hooks/content/useUpdateContent";
import { FileUploadInput } from "./ContentFileUploadInput";
import { validateForm } from "./ContentValidation";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { TitleInput } from "./ContentTitleInput";
import { DescriptionInput } from "./ContentDescriptionInput";
import { QuizInput } from "./ContentQuizInput";

interface ContentInputFormProps {
  lessonId: string;
  initialData?: CreateLessonContentInput | null;
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
  const [title, setTitle] = useState(initialData?.data.title || "");
  const [description, setDescription] = useState(
    initialData?.data.description || ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState(initialData?.data.fileUrl || "");
  const [questions, setQuestions] = useState<
    { question: string; options: string[]; answer: string }[]
  >(initialData?.data.questions || []);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<{
    title?: string;
    file?: string;
    questions?: string;
    newQuestion?: string;
    newOptions?: string;
    newAnswer?: string;
  }>({});

  const { mutate: createContent, isPending: isCreating } = useCreateContent();
  const { mutate: updateContent, isPending: isUpdating } = useUpdateContent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(type, title, file, fileUrl, questions, setErrors)) return;

    let finalFileUrl = fileUrl;
    if (file) {
      try {
        finalFileUrl = await FileUploadInput.uploadToCloudinary(
          file,
          type,
          setUploadStatus,
          setUploadProgress
        );
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          file: "Failed to upload file",
        }));
        return;
      }
    }

    const data: CreateLessonContentInput = {
      lessonId,
      type,
      status: finalFileUrl ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
      data: {
        title,
        description: description || undefined,
        ...(type === ContentType.VIDEO || type === ContentType.DOCUMENT
          ? { fileUrl: finalFileUrl }
          : { questions }),
      },
    };

    if (initialData?.lessonId) {
      const updateData: UpdateLessonContentInput = {
        id: initialData.lessonId,
        type: data.type,
        status: data.status,
        data: data.data,
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-lg shadow-md"
    >
      <ContentTypeSelector type={type} setType={setType} />
      <TitleInput title={title} setTitle={setTitle} errors={errors} />
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
          uploadStatus={uploadStatus}
          uploadProgress={uploadProgress}
          errors={errors}
        />
      )}
      {type === ContentType.QUIZ && (
        <QuizInput
          questions={questions}
          setQuestions={setQuestions}
          errors={errors}
          setErrors={(quizErrors) => setErrors(prev => ({ ...prev, ...quizErrors }))}
        />
      )}
      <button
        type="submit"
        disabled={isCreating || isUpdating}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isCreating || isUpdating ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
