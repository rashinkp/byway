"use client";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
import Image from "next/image";

interface CourseCardProps {
	course: Course;
	className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
	const router = useRouter();

	const handleCardClick = () => {
		router.push(`/courses/${course.id}`);
	};

	// Calculate price display
	const originalPrice = course.price ? Number(course.price) : 0;
	const offerPrice = course.offer ? Number(course.offer) : 0;
	const hasDiscount = offerPrice > 0 && offerPrice < originalPrice;
	const discountPercentage = hasDiscount 
		? Math.round(((originalPrice - offerPrice) / originalPrice) * 100) 
		: 0;

	// Format price to currency
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price);
	};

	return (
		<div
			className={cn(
				"rounded-2xl shadow-lg cursor-pointer overflow-hidden hover:shadow-xl transition-shadow duration-300 ",
				className,
			)}
			style={{
				background: "var(--color-surface)",
				color: "var(--color-primary-dark)",
				height: "400px",
				minHeight: "400px",
			}}
			onClick={handleCardClick}
			role="button"
			tabIndex={0}
		>
			{/* Hero Image */}
			<div className="relative h-48 overflow-hidden">
				<Image
					src={course.thumbnail || "/placeHolder.jpg"}
					alt={course.title}
					className="w-full h-full object-cover"
					width={400}
					height={192}
				/>
				{/* Discount Badge */}
				{hasDiscount && (
					<div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
						-{discountPercentage}%
					</div>
				)}
			</div>
			{/* Content */}
			<div className="p-6 flex flex-col">
				{/* Profile Section */}
				<div className="flex items-center gap-2 mb-3">
					<Image
						src={
							(course.instructor &&
								"profileImage" in course.instructor &&
								(course.instructor as any).profileImage) ||
							"/UserProfile.jpg"
						}
						alt={course.instructor?.name || "Instructor"}
						className="w-9 h-9 rounded-full object-cover"
						width={36}
						height={36}
					/>
					<div>
						<h3 className="font-medium text-sm text-[var(--color-primary-dark)]">
							{course.instructor?.name || "Unknown"}
						</h3>
						<p className="text-xs text-[var(--color-primary-light)]">
							{(course.instructor &&
								"role" in course.instructor &&
								(course.instructor as any).role) ||
								"Instructor"}
						</p>
					</div>
				</div>
				{/* Title */}
				<h2
					className="text-xl font-bold mb-1 line-clamp-1"
					style={{ color: "var(--foreground)" }}
				>
					<span className="text-[var(--color-primary-dark)]">
						{course.title}
					</span>
				</h2>
				{/* Description */}
				<p className="text-sm mb-1 leading-relaxed line-clamp-2 text-[var(--color-primary-light)]">
					{course.description || "No description available."}
				</p>
				{/* Price Section */}
				<div className="flex items-center gap-2 mb-2">
					{originalPrice > 0 ? (
						<>
							{hasDiscount ? (
								<>
									<span className="text-lg font-bold text-[var(--color-primary-dark)]">
										{formatPrice(offerPrice)}
									</span>
									<span className="text-sm text-[var(--color-primary-light)] line-through">
										{formatPrice(originalPrice)}
									</span>
								</>
							) : (
								<span className="text-lg font-bold text-[var(--color-primary-dark)]">
									{formatPrice(originalPrice)}
								</span>
							)}
						</>
					) : (
						<span className="text-lg font-bold text-green-600">
							Free
						</span>
					)}
				</div>

			</div>
		</div>
	);
}
