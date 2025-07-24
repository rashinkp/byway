interface TitleInputProps {
	title: string;
	setTitle: (title: string) => void;
	errors: { title?: string };
}

export const TitleInput = ({ title, setTitle, errors }: TitleInputProps) => {
	return (
		<div>
			<label className="block text-sm font-semibold text-black dark:text-white mb-1">
				Title
			</label>
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className={`w-full p-3 border rounded-xl bg-white dark:bg-[#232323] text-black dark:text-white focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] transition-all duration-300 ${
					errors.title ? "border-red-500" : "border-gray-200 dark:border-gray-700"
				}`}
				placeholder="Enter content title"
			/>
			{errors.title && (
				<p className="mt-1 text-sm text-red-500">{errors.title}</p>
			)}
		</div>
	);
};
