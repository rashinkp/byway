interface DescriptionInputProps {
	description: string;
	setDescription: (description: string) => void;
}

export const DescriptionInput = ({
	description,
	setDescription,
}: DescriptionInputProps) => {
	return (
		<div>
			<label className="block text-sm font-semibold text-black dark:text-white mb-1">
				Description
			</label>
			<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				className="w-full p-3 border rounded-xl bg-white dark:bg-[#232323] text-black dark:text-white border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] transition-all duration-300"
				placeholder="Enter content description"
				rows={4}
			/>
		</div>
	);
};
