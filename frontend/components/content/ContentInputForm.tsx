"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ContentType,
  ContentStatus,
  CreateLessonContentInput,
  UpdateLessonContentInput,
} from "@/types/content";
import { toast } from "sonner";
import { useCreateContent } from "@/hooks/content/useCreateContent";
import { useUpdateContent } from "@/hooks/content/useUpdateContent";

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
  const [fileUrl, setFileUrl] = useState(initialData?.data.fileUrl || "");
  const [questions, setQuestions] = useState<
    { question: string; options: string[]; answer: string }[]
  >(initialData?.data.questions || []);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [newAnswer, setNewAnswer] = useState("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const { mutate: createContent, isPending: isCreating } = useCreateContent();
  const { mutate: updateContent, isPending: isUpdating } = useUpdateContent();

  useEffect(() => {
    if (window.cloudinary) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      toast.error("Failed to load Cloudinary widget");
      setIsScriptLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      setTimeout(() => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      }, 1000);
    };
  }, []);

  const openCloudinaryWidget = useCallback(() => {
    if (!isScriptLoaded || !window.cloudinary) {
      toast.error("Cloudinary widget not loaded. Please try again.");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary configuration missing. Please contact support.");
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    window.cloudinary.openUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ["local", "url"],
        resourceType: type === ContentType.VIDEO ? "video" : "auto",
        maxFileSize: 100000000, // 100 MB
      },
      (error: any, result: any) => {
        if (error) {
          setUploadStatus("error");
          toast.error("Upload failed: " + (error.message || "Unknown error"));
          return;
        }
        if (result.event === "success") {
          setFileUrl(result.info.secure_url);
          setUploadStatus("success");
          toast.success("Upload completed");
        }
        if (result.event === "progress") {
          setUploadProgress((result.info.loaded / result.info.total) * 100);
        }
      }
    );
  }, [isScriptLoaded, type]);

  const handleAddQuestion = () => {
    if (!newQuestion || newOptions.some((opt) => !opt) || !newAnswer) {
      toast.error("Please fill out all question fields");
      return;
    }
    setQuestions([
      ...questions,
      { question: newQuestion, options: newOptions, answer: newAnswer },
    ]);
    setNewQuestion("");
    setNewOptions(["", "", "", ""]);
    setNewAnswer("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required");
      return;
    }
    if (
      (type === ContentType.VIDEO || type === ContentType.DOCUMENT) &&
      !fileUrl
    ) {
      toast.error("File URL is required for Video or Document");
      return;
    }
    if (type === ContentType.QUIZ && questions.length === 0) {
      toast.error("At least one question is required for Quiz");
      return;
    }

    const data: CreateLessonContentInput = {
      lessonId,
      type,
      status: fileUrl ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
      data: {
        title,
        description: description || undefined,
        ...(type === ContentType.VIDEO || type === ContentType.DOCUMENT
          ? { fileUrl }
          : { questions }),
      },
    };

    if (initialData?.id) {
      const updateData: UpdateLessonContentInput = {
        id: initialData.id,
        type: data.type,
        status: data.status,
        data: data.data,
      };
      updateContent(updateData, {
        onSuccess: () => {
          toast.success("Content updated successfully");
          onSuccess?.();
        },
        onError: (error) => toast.error(error.message),
      });
    } else {
      createContent(data, {
        onSuccess: () => {
          toast.success("Content created successfully");
          onSuccess?.();
        },
        onError: (error) => toast.error(error.message),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Content Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ContentType)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value={ContentType.VIDEO}>Video</option>
          <option value={ContentType.DOCUMENT}>Document</option>
          <option value={ContentType.QUIZ}>Quiz</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter content title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter content description"
          rows={4}
        />
      </div>
      {(type === ContentType.VIDEO || type === ContentType.DOCUMENT) && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            File or URL
          </label>
          <div className="mt-1 flex space-x-4">
            <button
              type="button"
              onClick={openCloudinaryWidget}
              disabled={uploadStatus === "uploading" || !isScriptLoaded}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Upload File
            </button>
            <input
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter file URL"
            />
          </div>
          {uploadStatus === "uploading" && (
            <div className="mt-2">
              <p>Uploading...</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          {uploadStatus === "success" && (
            <p className="mt-2 text-green-600">Upload Complete</p>
          )}
          {uploadStatus === "error" && (
            <p className="mt-2 text-red-600">Upload Failed</p>
          )}
        </div>
      )}
      {type === ContentType.QUIZ && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Questions
          </label>
          {questions.map((q, index) => (
            <div key={index} className="mt-2 p-4 border rounded-md">
              <p>{q.question}</p>
              <ul className="list-disc pl-5">
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <p>Answer: {q.answer}</p>
            </div>
          ))}
          <div className="mt-4">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter question"
            />
            {newOptions.map((opt, i) => (
              <input
                key={i}
                type="text"
                value={opt}
                onChange={(e) => {
                  const updated = [...newOptions];
                  updated[i] = e.target.value;
                  setNewOptions(updated);
                }}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={`Option ${i + 1}`}
              />
            ))}
            <input
              type="text"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter correct answer"
            />
            <button
              type="button"
              onClick={handleAddQuestion}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Question
            </button>
          </div>
        </div>
      )}
      <button
        type="submit"
        disabled={isCreating || isUpdating}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isCreating || isUpdating ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
