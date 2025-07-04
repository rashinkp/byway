import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
			className="bg-white rounded-2xl shadow-lg cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300 max-w-xs w-full flex flex-col"
			onClick={() => {
				const id = instructor.user?.id || instructor.id;
				router.push(`/instructors/${id}`);
			}}
			role="button"
			tabIndex={0}
		>
			<div className="h-40 w-full overflow-hidden">
				<Image
					src={instructor.user.avatar}
					alt={instructor.user.name}
					className="w-full h-full object-cover p-5"
					width={160}
					height={160}
				/>
			</div>
			<div className="p-6 flex flex-col flex-1">
				<h3 className="text-lg font-semibold text-[var(--color-primary-dark)] mb-1 line-clamp-1">
					{instructor.user.name}
				</h3>
				<p className="text-sm text-[var(--color-primary-light)] mb-1 line-clamp-1">
					{instructor.areaOfExpertise}
				</p>
				<p className="text-sm text-gray-500 line-clamp-2">
					{instructor.professionalExperience}
				</p>
			</div>
		</div>
	);
}
