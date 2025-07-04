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
			<label className="block text-sm font-semibold text-gray-700 mb-1">
				Description
			</label>
			<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
				placeholder="Enter content description"
				rows={4}
			/>
		</div>
	);
};
