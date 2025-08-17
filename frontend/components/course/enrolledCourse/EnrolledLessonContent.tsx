"use client";

import { FileText} from "lucide-react";
import { ILesson } from "@/types/lesson";
import { QuizQuestion } from "@/types/content";
import type { LessonContent } from "@/types/content";
import { useState } from "react";
import { IQuizAnswer } from "@/types/progress";
import ErrorDisplay from "@/components/ErrorDisplay";
import Image from 'next/image';
import { Button } from "@/components/ui/button";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
  isLocked?: boolean;
  score?: number;
  totalQuestions?: number;
  answers?: IQuizAnswer[];
}

interface LessonContentProps {
  selectedLesson: LessonWithCompletion;
  content?: LessonContent | null; 
  isContentLoading: boolean;
  isContentError: boolean;
  contentError: Error | null;
  currentLessonIndex: number;
  allLessons: LessonWithCompletion[];
  goToPrevLesson: () => void;
  goToNextLesson: () => void;
  markLessonComplete: (quizData?: { 
    answers: IQuizAnswer[], 
    score: number, 
    totalQuestions: number 
  }) => void;
}

export function LessonContent({
  selectedLesson,
  content,
  isContentError,
  contentError,
  currentLessonIndex,
  allLessons,
  goToPrevLesson,
  goToNextLesson,
  markLessonComplete,
}: LessonContentProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleQuizSubmit = () => {
    if (!content?.quizQuestions) return;

    const answers: IQuizAnswer[] = content.quizQuestions.map((question: QuizQuestion) => {
      const selectedAnswer = selectedAnswers[question.id];
      const isCorrect = selectedAnswer === question.correctAnswer;
      
      return {
        questionId: question.id,
        selectedAnswer: selectedAnswer || '',
        isCorrect
      };
    });

    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalQuestions = content.quizQuestions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    markLessonComplete({
      answers,
      score,
      totalQuestions
    });
  };

  // Helper to detect file type based on URL extension
  const getFileType = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (extension === "pdf") return "pdf";
    if (extension === "doc" || extension === "docx") return "doc";
    return "unknown";
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white truncate">
          {selectedLesson.title}
        </h1>
        <div className="flex space-x-3">
          <Button
            variant={"ghost"}
            disabled={currentLessonIndex === 0}
            onClick={goToPrevLesson}
          >
            Previous
          </Button>
          <Button
            className="px-5 py-2 bg-blue-500 dark:bg-yellow-400 text-white dark:text-black rounded-lg hover:bg-blue-600 dark:hover:bg-yellow-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-700 dark:disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            disabled={
              currentLessonIndex === allLessons.length - 1 ||
              !selectedLesson.completed
            }
            onClick={goToNextLesson}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="bg-white dark:bg-[#18181b] shadow-xl rounded-xl overflow-hidden">
        <div className="">
          <p className="text-gray-500 dark:text-gray-300 leading-relaxed mb-4 line-clamp-2">
            {selectedLesson.description || "No description available."}
          </p>
        </div>
        {isContentError ? (
          <ErrorDisplay
            error={contentError}
            title="Lesson Content Error"
            description="There was a problem loading this lesson content. Please try again."
          />
        ) : !content ? (
          <div className="p-6 text-gray-500 dark:text-gray-300">
            No content available.
          </div>
        ) : (
          <>
            {content.type === "VIDEO" && (
              <div className="relative w-full  mx-auto">
                <div
                  className="relative"
                  style={{
                    width: "1000px",
                    height: "550px",
                  }}
                >
                  <video
                    controls
                    poster={content.thumbnailUrl || "/api/placeholder/800/450"}
                    className="w-full h-full rounded-lg object-cover"
                    style={{ objectFit: "cover" }}
                  >
                    <source
                      src={content.fileUrl ?? undefined}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
            {content.type === "DOCUMENT" && (
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-semibold text-black dark:text-white">
                      Document
                    </span>
                  </div>
                  {content.fileUrl && (
                    <a
                      href={content.fileUrl}
                      download
                      className=" text-white dark:text-black rounded-lg  transition-colors"
                    >
                      Download{" "}
                      {getFileType(content.fileUrl) === "pdf"
                        ? "PDF"
                        : "Document"}
                    </a>
                  )}
                </div>
                <div className=" mt-5">
                  <div className=" rounded-lg min-h-64">
                    {content.fileUrl ? (
                      getFileType(content.fileUrl) === "pdf" ? (
                        <>
                          <iframe
                            src={content.fileUrl}
                            className="w-full h-[600px] rounded mb-4"
                            title="Document preview"
                            onError={(e) => {
                              console.error("Iframe load error:", e);
                            }}
                          />
                          <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
                            If the PDF doesn't load, use the download button
                            above.
                          </p>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <FileText
                            size={48}
                            className="text-gray-500 dark:text-gray-300 mx-auto mb-4"
                          />
                          <p className="text-black dark:text-white font-medium">
                            Word documents cannot be previewed in the browser.
                          </p>
                          <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
                            Please download the document to view it.
                          </p>
                        </div>
                      )
                    ) : (
                      <Image
                        src={(content.thumbnailUrl as string) || "/api/placeholder/800/600"}
                        alt="Document preview"
                        width={800}
                        height={600}
                        className="w-full object-contain mb-4 rounded"
                      />
                    )}
                    {!content.fileUrl && (
                      <p className="text-red-500 text-sm mt-2">
                        No document available for preview.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {content.type === "QUIZ" && (
              <div className="">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                  Quiz: {content.title || "Untitled Quiz"}
                </h3>
                {selectedLesson.completed &&
                  selectedLesson.score !== undefined && (
                    <div className="mb-6 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-[#facc15]">
                            Quiz Results
                          </h4>
                          <p className="text-[#facc15]">
                            Score: {selectedLesson.score}% (
                            {(selectedLesson.score *
                              (selectedLesson.totalQuestions || 0)) /
                              100}{" "}
                            out of {selectedLesson.totalQuestions || 0} correct)
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-[#facc15]">
                          {selectedLesson.score}%
                        </div>
                      </div>
                    </div>
                  )}
                <div className="space-y-6">
                  {content.quizQuestions?.map(
                    (question: QuizQuestion, index: number) => {
                      return (
                        <div
                          key={question.id}
                          className=" p-6 rounded-xl dark:bg-gray-800 bg-white shadow-md"
                        >
                          <h3 className="text-lg font-medium text-black dark:text-white mb-4">
                            Question {index + 1}: {question.question}
                          </h3>
                          <ul className="space-y-3 mb-4">
                            {question.options.map(
                              (option: string, idx: number) => {
                                const isSelected =
                                  selectedAnswers[question.id] === option;
                                const isCorrect =
                                  option === question.correctAnswer;
                                const showResult = selectedLesson.completed;
                                const submittedAnswer =
                                  selectedLesson.answers?.find(
                                    (a) => a.questionId === question.id
                                  );
                                const isUserAnswer =
                                  submittedAnswer?.selectedAnswer === option;
                                const isWrongAnswer =
                                  isUserAnswer && !isCorrect;

                                return (
                                  <li
                                    key={idx}
                                    className={`flex items-center p-3 rounded-lg ${
                                      showResult
                                        ? isCorrect
                                          ? "bg-green-100 border border-green-200 dark:bg-green-900 dark:border-green-700"
                                          : isWrongAnswer
                                          ? "bg-red-100 border border-red-200 dark:bg-red-900 dark:border-red-700"
                                          : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700"
                                        : isSelected
                                        ? "bg-blue-100 border border-blue-200 dark:bg-blue-900 dark:border-blue-700"
                                        : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      id={`question-${question.id}-option-${idx}`}
                                      name={`question-${question.id}`}
                                      className="mr-3 accent-blue-600"
                                      checked={isSelected}
                                      onChange={() =>
                                        handleAnswerSelect(question.id, option)
                                      }
                                      disabled={selectedLesson.completed}
                                    />
                                    <label
                                      htmlFor={`question-${question.id}-option-${idx}`}
                                      className={`${
                                        showResult
                                          ? isCorrect
                                            ? "text-green-800 font-medium dark:text-green-300"
                                            : isWrongAnswer
                                            ? "text-red-800 font-medium dark:text-red-300"
                                            : "text-gray-600 dark:text-gray-300"
                                          : isSelected
                                          ? "text-gray-800 font-medium dark:text-gray-300"
                                          : "text-gray-600 dark:text-gray-300"
                                      }`}
                                    >
                                      {option}
                                    </label>
                                    {showResult && (
                                      <div className="ml-auto flex gap-2">
                                        {isCorrect && (
                                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                            Correct Answer
                                          </span>
                                        )}
                                        {isWrongAnswer && (
                                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                            Your Answer
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <div className="p-6 flex justify-between items-center">
          {content && content.type === "QUIZ" ? (
            <button
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                selectedLesson.completed
                  ? "bg-gray-200 text-gray-700 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                  : "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              }`}
              onClick={handleQuizSubmit}
              disabled={
                selectedLesson.completed ||
                Object.keys(selectedAnswers).length !==
                  (content.quizQuestions?.length || 0)
              }
            >
              {selectedLesson.completed ? "Completed" : "Submit Quiz"}
            </button>
          ) : (
            <button
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                selectedLesson.completed
                  ? "bg-gray-200 text-gray-700 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                  : "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              }`}
              onClick={() => markLessonComplete()}
              disabled={selectedLesson.completed}
            >
              {selectedLesson.completed ? "Completed" : "Mark as Complete"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
