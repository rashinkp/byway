import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Video, FileText, HelpCircle } from "lucide-react";
import { useGetContentByLessonId } from "@/hooks/content/useGetContentByLessonId";
import { ContentType } from "@/types/content";
import { ContentSectionSkeleton } from "@/components/skeleton/LessonContentSectionSkeleton";

interface CourseSyllabusProps {
  lessons: any[] | undefined;
  isLoading: boolean;
}

export default function CourseSyllabus({
  lessons,
  isLoading,
}: CourseSyllabusProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const toggleModule = (moduleTitle: string) => {
    if (expandedModules.includes(moduleTitle)) {
      setExpandedModules(
        expandedModules.filter((title) => title !== moduleTitle)
      );
    } else {
      setExpandedModules([...expandedModules, moduleTitle]);
    }
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <LoadingSpinner size="sm" text="Loading syllabus..." />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-[var(--color-primary-dark)]">Syllabus</h2>
      {(!lessons || lessons.length === 0) ? (
        <div className="bg-[var(--color-background)] border border-[var(--color-primary-light)]/20 rounded-lg p-6 text-center">
          <p className="text-[var(--color-muted)] text-base font-medium">Syllabus is not available. Please contact the team.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div key={index} className="border rounded-lg overflow-hidden border-[var(--color-primary-light)]/20">
              <button
                className="w-full flex justify-between items-center p-4 bg-[var(--color-background)]"
                onClick={() => toggleModule(lesson.title)}
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform ${
                      expandedModules.includes(lesson.title) ? "rotate-180" : ""
                    }`}
                  />
                  {lesson.contentType === "VIDEO" && <Video className="w-4 h-4 text-blue-500" />}
                  {lesson.contentType === "DOCUMENT" && <FileText className="w-4 h-4 text-blue-500" />}
                  {lesson.contentType === "QUIZ" && <HelpCircle className="w-4 h-4 text-blue-500" />}
                  <span className="font-medium text-[var(--color-primary-dark)]">{lesson.title}</span>
                </div>
                <div className="text-[var(--color-muted)] text-sm">{lesson.order}</div>
              </button>
              {expandedModules.includes(lesson.title) && (
                <AdminLessonContent lessonId={lesson.id} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminLessonContent({ lessonId }: { lessonId: string }) {
  const { data: content, isLoading } = useGetContentByLessonId(lessonId);
  if (isLoading) {
    return <div className="py-4"><ContentSectionSkeleton /></div>;
  }
  if (!content) {
    return (
      <div className="py-8 flex flex-col items-center justify-center text-center">
        <div className="text-[var(--color-muted)] text-lg font-medium">No content for this lesson.</div>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-4 md:p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-primary-light)]/10 shadow-sm">
      {/* Title and icon */}
      <div className="flex items-center gap-3 mb-2">
        {content.type === ContentType.VIDEO && <Video className="w-6 h-6 text-[var(--color-primary-dark)]" />}
        {content.type === ContentType.DOCUMENT && <FileText className="w-6 h-6 text-[var(--color-primary-dark)]" />}
        {content.type === ContentType.QUIZ && <HelpCircle className="w-6 h-6 text-[var(--color-primary-dark)]" />}
        <h3 className="text-xl font-bold text-[var(--color-primary-dark)]">{content.title || "Lesson Content"}</h3>
      </div>
      {/* Description */}
      {content.description && (
        <div className="text-[var(--color-muted)] mb-2">{content.description}</div>
      )}
      {/* Content body */}
      {content.type === ContentType.VIDEO && content.fileUrl && (
        <div className="rounded-xl overflow-hidden border border-[var(--color-primary-light)]/20 mb-2">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <video
              src={content.fileUrl}
              controls
              className="absolute top-0 left-0 w-full h-full object-contain bg-black"
              poster={content.thumbnailUrl || undefined}
            />
          </div>
        </div>
      )}
      {content.type === ContentType.DOCUMENT && content.fileUrl && (
        <div className="flex items-center p-4 bg-[var(--color-primary-dark)]/10 rounded-xl border border-[var(--color-primary-dark)]/20 mb-2">
          <FileText className="w-10 h-10 text-[var(--color-primary-dark)] mr-4" />
          <div>
            <h4 className="text-[var(--color-primary-dark)] font-medium mb-1">Document</h4>
            <a
              href={content.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary-dark)] hover:underline flex items-center mt-1 group"
            >
              View Document
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      )}
      {content.type === ContentType.QUIZ && content.quizQuestions && (
        <div className="space-y-6">
          {content.quizQuestions.map((q, index) => (
            <div key={index} className="bg-[var(--color-primary-dark)]/10 p-6 rounded-xl border border-[var(--color-primary-dark)]/20 mb-2">
              <h4 className="text-lg font-semibold text-[var(--color-primary-dark)] mb-2">
                Question {index + 1}: {q.question}
              </h4>
              <ul className="space-y-2 mb-2">
                {q.options.map((opt, i) => (
                  <li key={i} className="text-[var(--color-primary-dark)] pl-2">• {opt}</li>
                ))}
              </ul>
              {q.correctAnswer && (
                <div className="text-[var(--color-primary-dark)] font-semibold">Answer: {q.correctAnswer}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
