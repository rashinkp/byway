import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FolderOpen, Search } from "lucide-react";

interface EmptyStateFallbackProps {
	type: "courses" | "categories" | "instructors";
	title?: string;
	description?: string;
	actionText?: string;
	onAction?: () => void;
	className?: string;
}

const getIcon = (type: string) => {
	switch (type) {
		case "courses":
			return <BookOpen className="w-16 h-16 text-[#facc15]" />;
		case "categories":
			return <FolderOpen className="w-16 h-16 text-[#facc15]" />;
		case "instructors":
			return <Users className="w-16 h-16 text-[#facc15]" />;
		default:
			return <Search className="w-16 h-16 text-[#facc15]" />;
	}
};

const getDefaultContent = (type: string) => {
	switch (type) {
		case "courses":
			return {
				title: "No Courses Available",
				description: "We're working on adding amazing courses to our platform. Check back soon for new learning opportunities!",
				actionText: "Browse All Courses"
			};
		case "categories":
			return {
				title: "No Categories Found",
				description: "Categories help organize our learning content. We'll have them available soon!",
				actionText: "Explore Platform"
			};
		case "instructors":
			return {
				title: "No Instructors Available",
				description: "Our expert instructors are preparing amazing content. Stay tuned for updates!",
				actionText: "Learn More"
			};
		default:
			return {
				title: "No Content Available",
				description: "Content is being prepared. Please check back later!",
				actionText: "Refresh"
			};
	}
};

export function EmptyStateFallback({
	type,
	title,
	description,
	actionText,
	onAction,
	className = ""
}: EmptyStateFallbackProps) {
	const defaultContent = getDefaultContent(type);
	const finalTitle = title || defaultContent.title;
	const finalDescription = description || defaultContent.description;
	const finalActionText = actionText || defaultContent.actionText;

	return (
		<div className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}>
			<div className="mb-6">
				{getIcon(type)}
			</div>
			<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
				{finalTitle}
			</h3>
			<p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mb-8 leading-relaxed">
				{finalDescription}
			</p>
			{onAction && (
				<Button
					onClick={onAction}
					className="bg-[#facc15] hover:bg-[#facc15]/90 text-black font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
				>
					{finalActionText}
				</Button>
			)}
		</div>
	);
} 