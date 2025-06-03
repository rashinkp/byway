"use client";

import { FileText, CheckCircle, Clock } from "lucide-react";
import { ILesson } from "@/types/lesson";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { QuizQuestion } from "@/types/content";
import { useState } from "react";
import { IQuizAnswer } from "@/types/progress";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
  isLocked?: boolean;
  score?: number;
  totalQuestions?: number;
  answers?: IQuizAnswer[];
}

interface LessonContentProps {
  selectedLesson: LessonWithCompletion;
  content: any; // Replace with proper content type
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
  isContentLoading,
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
    if (!content.quizQuestions) return;

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
        <h1 className="text-3xl font-bold text-gray-800 truncate">
          {selectedLesson.title}
        </h1>
        <div className="flex space-x-3">
          <button
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            disabled={currentLessonIndex === 0}
            onClick={goToPrevLesson}
          >
            Previous
          </button>
          <button
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            disabled={
              currentLessonIndex === allLessons.length - 1 ||
              !selectedLesson.completed
            }
            onClick={goToNextLesson}
          >
            Next
          </button>
        </div>
      </div>
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 truncate">
            {selectedLesson.title}
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
            {selectedLesson.description || "No description available."}
          </p>
        </div>
        {isContentError ? (
          <div className="p-6 text-red-600">Error: {contentError?.message}</div>
        ) : !content ? (
          <div className="p-6 text-gray-600">No content available.</div>
        ) : (
          <>
            {content.type === "VIDEO" && (
              <div className="relative w-full max-w-[800px] mx-auto">
                <div
                  className="relative"
                  style={{
                    width: "800px",
                    height: "450px",
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
              <div className="border-b border-gray-200">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText size={26} className="text-blue-600 mr-3" />
                    <span className="font-semibold text-gray-800">
                      Document
                    </span>
                  </div>
                  {content.fileUrl && (
                    <a
                      href={content.fileUrl}
                      download
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Download{" "}
                      {getFileType(content.fileUrl) === "pdf"
                        ? "PDF"
                        : "Document"}
                    </a>
                  )}
                </div>
                <div className="p-6 bg-gray-50">
                  <div className="border border-gray-200 rounded-lg p-5 bg-white min-h-64">
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
                          <p className="text-gray-500 text-sm mt-2">
                            If the PDF doesn't load, use the download button
                            above.
                          </p>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <FileText
                            size={48}
                            className="text-gray-400 mx-auto mb-4"
                          />
                          <p className="text-gray-700 font-medium">
                            Word documents cannot be previewed in the browser.
                          </p>
                          <p className="text-gray-500 text-sm mt-2">
                            Please download the document to view it.
                          </p>
                        </div>
                      )
                    ) : (
                      <img
                        src={content.thumbnailUrl || "/api/placeholder/800/600"}
                        alt="Document preview"
                        className="w-full object-contain mb-4 rounded"
                      />
                    )}
                    <p className="text-gray-700 leading-relaxed">
                      {content.description || "No description available."}
                    </p>
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
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Quiz: {content.title}
                </h3>
                {selectedLesson.completed && selectedLesson.score !== undefined && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-green-800">Quiz Results</h4>
                        <p className="text-green-600">
                          Score: {selectedLesson.score}% ({selectedLesson.score * (selectedLesson.totalQuestions || 0) / 100} out of {selectedLesson.totalQuestions || 0} correct)
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {selectedLesson.score}%
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  {content.quizQuestions.map((question: QuizQuestion, index: number) => {
                    const submittedAnswer = selectedLesson.answers?.find(
                      a => a.questionId === question.id
                    );
                    const isUserAnswer = submittedAnswer?.selectedAnswer === question.correctAnswer;
                    const isWrongAnswer = isUserAnswer && !question.correctAnswer;
                    
                    return (
                      <div key={question.id} className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                          Question {index + 1}: {question.question}
                        </h3>
                        <ul className="space-y-3 mb-4">
                          {question.options.map((option: string, idx: number) => {
                            const isSelected = selectedAnswers[question.id] === option;
                            const isCorrect = option === question.correctAnswer;
                            const showResult = selectedLesson.completed;
                            const submittedAnswer = selectedLesson.answers?.find(
                              a => a.questionId === question.id
                            );
                            const isUserAnswer = submittedAnswer?.selectedAnswer === option;
                            const isWrongAnswer = isUserAnswer && !isCorrect;
                            
                            return (
                              <li
                                key={idx}
                                className={`flex items-center p-3 rounded-lg ${
                                  showResult
                                    ? isCorrect
                                      ? "bg-green-100 border border-green-200"
                                      : isWrongAnswer
                                      ? "bg-red-100 border border-red-200"
                                      : "bg-white border border-gray-200"
                                    : isSelected
                                    ? "bg-blue-100 border border-blue-200"
                                    : "bg-white border border-gray-200"
                                }`}
                              >
                                <input
                                  type="radio"
                                  id={`question-${question.id}-option-${idx}`}
                                  name={`question-${question.id}`}
                                  className="mr-3 accent-blue-600"
                                  checked={isSelected}
                                  onChange={() => handleAnswerSelect(question.id, option)}
                                  disabled={selectedLesson.completed}
                                />
                                <label
                                  htmlFor={`question-${question.id}-option-${idx}`}
                                  className={`${
                                    showResult
                                      ? isCorrect
                                        ? "text-green-800 font-medium"
                                        : isWrongAnswer
                                        ? "text-red-800 font-medium"
                                        : "text-gray-600"
                                      : isSelected
                                      ? "text-gray-800 font-medium"
                                      : "text-gray-600"
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
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center">
            {selectedLesson.completed ? (
              <>
                <CheckCircle size={22} className="text-green-600 mr-2" />
                <span className="text-green-600 font-medium">Completed</span>
              </>
            ) : (
              <>
                <Clock size={22} className="text-gray-500 mr-2" />
                <span className="text-gray-500 font-medium">Not completed</span>
              </>
            )}
          </div>
          {content && content.type === "QUIZ" ? (
            <button
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                selectedLesson.completed
                  ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              onClick={handleQuizSubmit}
              disabled={selectedLesson.completed || Object.keys(selectedAnswers).length !== content.quizQuestions.length}
            >
              {selectedLesson.completed ? "Completed" : "Submit Quiz"}
            </button>
          ) : (
            <button
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                selectedLesson.completed
                  ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
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
