// src/components/lesson/ContentInputForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ContentStatus, LessonContentFormData } from "@/types/lesson";
import { ContentType } from "@/types/lesson";

interface ContentInputFormProps {
  onSubmit: (data: LessonContentFormData) => void;
  initialData?: LessonContentFormData;
  onCancel?: () => void;
}

export function ContentInputForm({
  onSubmit,
  initialData,
  onCancel,
}: ContentInputFormProps) {
  const [type, setType] = useState<ContentType>(initialData?.type || "VIDEO");
  const [status, setStatus] = useState<ContentStatus>(
    initialData?.status || "DRAFT"
  );
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<
    { question: string; options: string[]; answer: string }[]
  >(initialData?.data.questions || []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: ["", ""], answer: "" },
    ]);
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const handleSubmit = () => {
    const data: LessonContentFormData = {
      type,
      status,
      data: {},
    };

    if (type === "VIDEO" || type === "DOC") {
      if (!file) {
        toast.error("Please select a file");
        return;
      }
      // Mock file URL (in real app, upload file and get URL)
      data.data.fileUrl = `https://example.com/${file.name}`;
    } else if (type === "QUIZ") {
      if (questions.length === 0) {
        toast.error("Please add at least one question");
        return;
      }
      for (const q of questions) {
        if (!q.question || q.options.some((opt) => !opt) || !q.answer) {
          toast.error("Please fill out all question fields");
          return;
        }
      }
      data.data.questions = questions;
    }

    onSubmit(data);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow mt-4">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? "Edit Content" : "Add Content"}
      </h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="type">Content Type</Label>
          <Select
            value={type}
            onValueChange={(value: ContentType) => setType(value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VIDEO">Video</SelectItem>
              <SelectItem value="DOC">Document</SelectItem>
              <SelectItem value="QUIZ">Quiz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value: ContentStatus) => setStatus(value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === "VIDEO" || type === "DOC" ? (
          <div>
            <Label htmlFor="file">
              Upload {type === "VIDEO" ? "Video" : "Document"}
            </Label>
            <Input
              id="file"
              type="file"
              accept={type === "VIDEO" ? "video/*" : ".pdf,.doc,.docx"}
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {file.name}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Label>Quiz Questions</Label>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="border p-4 rounded-lg space-y-2">
                <Input
                  placeholder="Question"
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(qIndex, "question", e.target.value)
                  }
                />
                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => (
                    <Input
                      key={optIndex}
                      placeholder={`Option ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) =>
                        updateOption(qIndex, optIndex, e.target.value)
                      }
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(qIndex)}
                  >
                    Add Option
                  </Button>
                </div>
                <Input
                  placeholder="Correct Answer"
                  value={q.answer}
                  onChange={(e) =>
                    updateQuestion(qIndex, "answer", e.target.value)
                  }
                />
              </div>
            ))}
            <Button variant="outline" onClick={addQuestion}>
              Add Question
            </Button>
          </div>
        )}

        <div className="flex space-x-2">
          <Button onClick={handleSubmit}>
            {initialData ? "Update" : "Save"}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
