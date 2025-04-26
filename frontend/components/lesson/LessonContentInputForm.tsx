"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LessonContentFormData } from "@/types/lesson";

interface ContentInputFormProps {
  contentType: "VIDEO" | "DOC" | "QUIZ";
  onSubmit: (data: LessonContentFormData) => void;
  initialData?: LessonContentFormData;
  onCancel: () => void;
}

export function ContentInputForm({
  contentType,
  onSubmit,
  initialData,
  onCancel,
}: ContentInputFormProps) {
  const [title, setTitle] = useState(initialData?.data.title || "");
  const [description, setDescription] = useState(
    initialData?.data.description || ""
  );
  const [fileUrl, setFileUrl] = useState(initialData?.data.fileUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<
    { question: string; options: string[]; answer: string }[]
  >(
    initialData?.data.questions || [
      { question: "", options: ["", "", ""], answer: "" },
    ]
  );

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", ""], answer: "" },
    ]);
  };

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    const newQuestions = [...questions];
    if (field === "options") {
      newQuestions[index].options = value as string[];
    } else {
      newQuestions[index][field as "question" | "answer"] = value as string;
    }
    setQuestions(newQuestions);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setFileUrl(URL.createObjectURL(file)); // Temporary URL for preview
    }
  };

  const handleSubmit = () => {
    const data: LessonContentFormData = {
      type: contentType,
      status: initialData?.status || "DRAFT",
      data: {
        title,
        description,
        ...(contentType === "QUIZ" ? { questions } : { fileUrl }),
      },
    };
    onSubmit(data);
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500   p-3 transition-colors"
          placeholder="Enter content title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500   p-3 transition-colors"
          placeholder="Enter content description"
          rows={5}
        />
      </div>

      {(contentType === "VIDEO" || contentType === "DOC") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {contentType === "VIDEO" ? "Video" : "Document"} File
          </label>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept={contentType === "VIDEO" ? "video/*" : ".pdf,.doc,.docx"}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter a URL
              </label>
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => {
                  setFileUrl(e.target.value);
                  setSelectedFile(null);
                }}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500   p-3 transition-colors"
                placeholder="Enter file URL (e.g., https://example.com/file)"
              />
            </div>
          </div>
        </div>
      )}

      {contentType === "QUIZ" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Questions
          </label>
          {questions.map((q, index) => (
            <div key={index} className="mb-6 p-6 bg-gray-100 rounded-lg">
              <input
                type="text"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500   p-3 mb-4 transition-colors"
                placeholder="Enter question"
              />
              {q.options.map((option, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...q.options];
                    newOptions[optIndex] = e.target.value;
                    handleQuestionChange(index, "options", newOptions);
                  }}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500   p-3 mb-2 transition-colors"
                  placeholder={`Option ${optIndex + 1}`}
                />
              ))}
              <input
                type="text"
                value={q.answer}
                onChange={(e) =>
                  handleQuestionChange(index, "answer", e.target.value)
                }
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500   p-3 transition-colors"
                placeholder="Correct answer"
              />
            </div>
          ))}
          <Button
            onClick={handleAddQuestion}
            className="bg-blue-500 hover:bg-blue-600 text-white  px-6 py-3 rounded-lg transition-colors"
          >
            Add Question
          </Button>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white  px-6 py-3 rounded-lg transition-colors"
        >
          {initialData ? "Update" : "Submit"}
        </Button>
        <Button
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800  px-6 py-3 rounded-lg transition-colors"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
