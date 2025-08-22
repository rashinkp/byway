"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ILesson } from "@/types/lesson";
import { QuizQuestion } from "@/types/content";
import type { LessonContent } from "@/types/content";
import { useState, useEffect } from "react";
import { IQuizAnswer } from "@/types/progress";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { useSignedUrl } from "@/hooks/file/useSignedUrl";

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
  const [iframeLoaded, setIframeLoaded] = useState(false);

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

  // Resolve S3 keys to signed URLs for secure playback and downloads
  const isAbsoluteUrl = (v?: string | null) => !!v && (v.startsWith("http://") || v.startsWith("https://"));
  const shouldSignVideo = content?.type === "VIDEO" && content.fileUrl && !isAbsoluteUrl(content.fileUrl);
  const shouldSignThumb = content?.type === "VIDEO" && content.thumbnailUrl && !isAbsoluteUrl(content.thumbnailUrl);
  const shouldSignDoc = content?.type === "DOCUMENT" && content.fileUrl && !isAbsoluteUrl(content.fileUrl);

  const { url: signedVideoUrl, isLoading: videoUrlLoading } = useSignedUrl(shouldSignVideo ? (content!.fileUrl as string) : null, 3600, false);
  const { url: signedThumbUrl, isLoading: thumbUrlLoading } = useSignedUrl(shouldSignThumb ? (content!.thumbnailUrl as string) : null, 3600, false);
  const { url: signedDocUrl, isLoading: docUrlLoading } = useSignedUrl(shouldSignDoc ? (content!.fileUrl as string) : null, 600, false);

  const finalVideoSrc = shouldSignVideo ? signedVideoUrl : (content?.fileUrl || undefined);
  const finalPoster = shouldSignThumb ? signedThumbUrl : (content?.thumbnailUrl || undefined);
  const resolvedDocUrl = shouldSignDoc ? signedDocUrl : (content?.fileUrl || undefined);
  
  // PDF detection - exactly like admin version
  const isPdfDoc = typeof resolvedDocUrl === 'string'
    ? resolvedDocUrl.split('?')[0].toLowerCase().endsWith('.pdf')
    : false;

  // Reset loading state when content changes
  useEffect(() => {
    setIframeLoaded(false);
  }, [content?.id, resolvedDocUrl]);

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
        ) : isContentLoading || !content ? (
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {isContentLoading ? "Loading lesson content..." : "Preparing lesson..."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
                {content.type === "VIDEO" && (
                  <div className="relative w-full mx-auto">
                    <div
                      className="relative"
                      style={{
                        width: "1000px",
                        height: "550px",
                      }}
                    >
                      {/* Loading state for video URL */}
                      {shouldSignVideo && videoUrlLoading && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-300">Preparing video...</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Video player */}
                      {finalVideoSrc && !videoUrlLoading && (
                        <video
                          controls
                          poster={finalPoster || "/api/placeholder/800/450"}
                          className="w-full h-full rounded-lg object-cover"
                          style={{ objectFit: "cover" }}
                          src={finalVideoSrc}
                        >
                          <source
                            src={finalVideoSrc}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      
                      {/* Thumbnail loading state */}
                      {shouldSignThumb && thumbUrlLoading && !finalVideoSrc && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Loading thumbnail...</p>
                          </div>
                        </div>
                      )}
                      
                      {/* No video available */}
                      {!finalVideoSrc && !videoUrlLoading && (
                        <div className="text-center py-8">
                          <p className="text-gray-500 dark:text-gray-300">No video available for this lesson.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {content.type === "DOCUMENT" && (
                  <div className="space-y-2">
                    {/* Loading state for document URL */}
                    {shouldSignDoc && docUrlLoading && (
                      <div className="w-full h-[600px] flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          <p className="text-gray-600 dark:text-gray-300">Preparing document...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Document content when loaded */}
                    {resolvedDocUrl && !docUrlLoading && (
                      <>
                        <a
                          href={resolvedDocUrl}
                          download
                          className="inline-block px-4 py-2 bg-[#facc15] text-black dark:bg-[#facc15] dark:text-[#18181b] rounded font-semibold hover:bg-yellow-400 dark:hover:bg-yellow-400 transition-colors mb-2"
                        >
                          Download Document
                        </a>
                        {isPdfDoc ? (
                          <div className="w-full">
                            {!iframeLoaded && (
                              <Skeleton className="w-full h-[600px] rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            )}
                            <iframe
                              src={resolvedDocUrl}
                              className={`${!iframeLoaded ? 'hidden' : ''} w-full h-[600px] rounded border border-gray-200 dark:border-gray-700`}
                              title="Document preview"
                              onLoad={() => setIframeLoaded(true)}
                            />
                          </div>
                        ) : (
                          <div className="text-gray-500 dark:text-gray-300">Preview not available for this document type.</div>
                        )}
                      </>
                    )}
                    
                    {/* No document available */}
                    {!resolvedDocUrl && !docUrlLoading && (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-300">No document available for this lesson.</p>
                      </div>
                    )}
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
                                              ? "text-blue-800 font-medium dark:text-blue-300"
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
