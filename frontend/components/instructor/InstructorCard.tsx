import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "lucide-react";

interface InstructorCardProps {
	instructor: {
		id: string;
		areaOfExpertise: string;
		professionalExperience: string;
		user: {
			id: string;
			name: string;
			avatar: string;
		};
	};
}

export function InstructorCard({ instructor }: InstructorCardProps) {
	const router = useRouter();
	return (
		<div
			className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg cursor-pointer overflow-hidden max-w-xs w-full flex flex-col p-4"
			onClick={() => {
				const id = instructor.user?.id || instructor.id;
				router.push(`/instructors/${id}`);
			}}
			role="button"
			tabIndex={0}
		>
			<div className="flex justify-center mb-2">
				<div className="w-16 h-16 rounded-full ring-2 ring-[#facc15] bg-white dark:bg-neutral-900 shadow flex items-center justify-center overflow-hidden">
					{instructor.user.avatar ? (
						<Image
							src={instructor.user.avatar}
							alt={instructor.user.name}
							className="w-full h-full object-cover rounded-full"
							width={80}
							height={80}
						/>
					) : (
						<User className="w-10 h-10 text-[#facc15]" />
					)}
				</div>
			</div>
			<div className="flex flex-col flex-1">
				<h3 className="text-base font-semibold text-[#facc15] dark:text-[#facc15] mb-1 line-clamp-1 text-center">
					{instructor.user.name}
				</h3>
				<p className="text-xs text-neutral-600 dark:text-neutral-300 mb-1 line-clamp-1 text-center">
					{instructor.areaOfExpertise}
				</p>
				<p className="text-xs text-gray-500 dark:text-neutral-400 line-clamp-2 text-center">
					{instructor.professionalExperience}
				</p>
			</div>
		</div>
	);
}
