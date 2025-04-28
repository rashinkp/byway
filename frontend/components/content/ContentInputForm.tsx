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
import { FileUploadInput } from "./ContentFileUploadInput";
import { validateForm } from "./ContentValidation";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { TitleInput } from "./ContentTitleInput";
import { DescriptionInput } from "./ContentDescriptionInput";
import { QuizInput } from "./ContentQuizInput";
import { ThumbnailUploadInput } from "./ContentThumbnailInputSection";

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
    if (thumbnail && type === ContentType.VIDEO) {
      try {
        finalThumbnailUrl = await ThumbnailUploadInput.uploadToCloudinary(
          thumbnail,
          setThumbnailUploadStatus,
          setThumbnailUploadProgress
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
