import { Button } from "@/components/ui/button";
import { Lock, ChevronLeft, ChevronRight } from "lucide-react";

interface LessonNavigationProps {
	currentLessonIndex: number;
	allLessons: Array<{
		id: string;
		title: string;
		isLocked?: boolean;
	}>;
	selectedLesson: {
		id: string;
		title: string;
		isLocked?: boolean;
	} | null;
	goToPrevLesson: () => void;
	goToNextLesson: () => void;
}

export function LessonNavigation({
	currentLessonIndex,
	allLessons,
	goToPrevLesson,
	goToNextLesson,
}: LessonNavigationProps) {
	const isFirstLesson = currentLessonIndex === 0;
	const isLastLesson = currentLessonIndex === allLessons.length - 1;
	const nextLesson = allLessons[currentLessonIndex + 1];
	const isNextLessonLocked = nextLesson?.isLocked;

	return (
		<div className="flex justify-end items-center mt-8 pt-4 border-t">
			{!isFirstLesson ? (
				<Button
					variant="outline"
					onClick={goToPrevLesson}
					className="flex items-center gap-2"
				>
					<ChevronLeft className="w-4 h-4" />
					Previous Lesson
				</Button>
			) : (
				!isLastLesson && (
					<div className="flex items-center gap-2">
						{isNextLessonLocked && (
							<Lock className="w-4 h-4 text-muted-foreground" />
						)}
						<Button
							variant="default"
							onClick={goToNextLesson}
							disabled={isNextLessonLocked}
						>
							{isNextLessonLocked
								? "Complete Current Lesson to Unlock"
								: "Next Lesson"}
							<ChevronRight className="w-4 h-4 ml-2" />
						</Button>
					</div>
				)
			)}
		</div>
	);
}
