"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ContentType,
  ContentStatus,
  CreateLessonContentInput,
  UpdateLessonContentInput,
} from "@/types/content";
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
  const [file, setFile] = useState<File | null>(null);
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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      setErrors((prev) => ({
        ...prev,
        file: "Failed to load Cloudinary widget",
      }));
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

  const uploadToCloudinary = useCallback(
    async (file: File): Promise<string> => {
      if (!isScriptLoaded || !window.cloudinary) {
        throw new Error("Cloudinary widget not loaded");
      }

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration missing");
      }

      return new Promise((resolve, reject) => {
        setUploadStatus("uploading");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("cloud_name", cloudName);

        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/${
            type === ContentType.VIDEO ? "video" : "auto"
          }/upload`,
          true
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress((event.loaded / event.total) * 100);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setUploadStatus("success");
            resolve(response.secure_url);
          } else {
            setUploadStatus("error");
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => {
          setUploadStatus("error");
          reject(new Error("Upload failed"));
        };

        xhr.send(formData);
      });
    },
    [isScriptLoaded, type]
  );

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!title) newErrors.title = "Title is required";
    if (
      (type === ContentType.VIDEO || type === ContentType.DOCUMENT) &&
      !file &&
      !fileUrl
    ) {
      newErrors.file = "Please select a file or provide a URL";
    }
    if (type === ContentType.QUIZ && questions.length === 0) {
      newErrors.questions = "At least one question is required for Quiz";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuestion = () => {
    const newErrors: typeof errors = {};
    if (!newQuestion) newErrors.newQuestion = "Question is required";
    if (newOptions.some((opt) => !opt))
      newErrors.newOptions = "All options are required";
    if (!newAnswer) newErrors.newAnswer = "Answer is required";
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleAddQuestion = () => {
    if (!validateQuestion()) return;
    setQuestions([
      ...questions,
      { question: newQuestion, options: newOptions, answer: newAnswer },
    ]);
    setNewQuestion("");
    setNewOptions(["", "", "", ""]);
    setNewAnswer("");
    setErrors((prev) => ({
      ...prev,
      newQuestion: undefined,
      newOptions: undefined,
      newAnswer: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let finalFileUrl = fileUrl;
    if (file) {
      try {
        finalFileUrl = await uploadToCloudinary(file);
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          file: "Failed to upload file",
        }));
        return;
      }
    }

    // console.log("type before submitting", type);

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

    // console.log("data after selected", data);

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
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Content Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ContentType)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={ContentType.VIDEO}>Video</option>
          <option value={ContentType.DOCUMENT}>Document</option>
          <option value={ContentType.QUIZ}>Quiz</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter content title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter content description"
          rows={4}
        />
      </div>
      {(type === ContentType.VIDEO || type === ContentType.DOCUMENT) && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            File or URL
          </label>
          <div className="flex flex-col space-y-2">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-gray-300 rounded-md"
              accept={type === ContentType.VIDEO ? "video/*" : "*"}
            />
            <input
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.file ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Or enter file URL"
            />
            {errors.file && (
              <p className="mt-1 text-sm text-red-500">{errors.file}</p>
            )}
            {uploadStatus === "uploading" && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Uploading...</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            {uploadStatus === "success" && (
              <p className="mt-2 text-sm text-green-600">Upload Complete</p>
            )}
            {uploadStatus === "error" && (
              <p className="mt-2 text-sm text-red-500">Upload Failed</p>
            )}
          </div>
        </div>
      )}
      {type === ContentType.QUIZ && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Questions
          </label>
          {questions.length === 0 && errors.questions && (
            <p className="mt-1 text-sm text-red-500">{errors.questions}</p>
          )}
          {questions.map((q, index) => (
            <div
              key={index}
              className="mt-2 p-4 border border-gray-200 rounded-md bg-gray-50"
            >
              <p className="font-medium">{q.question}</p>
              <ul className="list-disc pl-5 mt-2">
                {q.options.map((opt, i) => (
                  <li key={i} className="text-sm text-gray-600">
                    {opt}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-gray-700">
                Answer: <span className="font-medium">{q.answer}</span>
              </p>
            </div>
          ))}
          <div className="mt-4 space-y-3">
            <div>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.newQuestion ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter question"
              />
              {errors.newQuestion && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.newQuestion}
                </p>
              )}
            </div>
            {newOptions.map((opt, i) => (
              <div key={i}>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const updated = [...newOptions];
                    updated[i] = e.target.value;
                    setNewOptions(updated);
                  }}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    errors.newOptions ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={`Option ${i + 1}`}
                />
                {i === 0 && errors.newOptions && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.newOptions}
                  </p>
                )}
              </div>
            ))}
            <div>
              <input
                type="text"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.newAnswer ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter correct answer"
              />
              {errors.newAnswer && (
                <p className="mt-1 text-sm text-red-500">{errors.newAnswer}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Question
            </button>
          </div>
        </div>
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
