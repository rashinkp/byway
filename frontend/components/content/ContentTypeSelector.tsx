import { ContentType } from "@/types/content";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ContentTypeSelectorProps {
	type: ContentType;
	setType: (type: ContentType) => void;
}

export const ContentTypeSelector = ({
	type,
	setType,
}: ContentTypeSelectorProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const options = [
		{ value: ContentType.VIDEO, label: "Video" },
		{ value: ContentType.DOCUMENT, label: "Document" },
		{ value: ContentType.QUIZ, label: "Quiz" },
	];

	return (
		<div className="relative">
			<label className="block text-sm font-semibold text-gray-700 mb-1">
				Content Type
			</label>
			<div className="relative">
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="w-full p-3 border border-gray-300 rounded-xl bg-white text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
				>
					<span>{options.find((opt) => opt.value === type)?.label}</span>
					<ChevronDown className="h-5 w-5 text-gray-500" />
				</button>
				{isOpen && (
					<ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
						{options.map((option) => (
							<li
								key={option.value}
								onClick={() => {
									setType(option.value);
									setIsOpen(false);
								}}
								className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all duration-200"
							>
								{option.label}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};
