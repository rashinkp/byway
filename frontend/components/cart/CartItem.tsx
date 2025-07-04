import type { ICart } from "@/types/cart";
import { Award, BookOpen, Clock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface CartItemProps {
	item: ICart;
	isRemoving: boolean;
	onRemove: (courseId: string) => void;
}

export function CartItem({ item, isRemoving, onRemove }: CartItemProps) {
	const course = item.course;
	if (!course) return null;

	const offerPrice =
		typeof course.offer === "string"
			? parseFloat(course.offer)
			: typeof course.offer === "number"
				? course.offer
				: (course.price ?? 0);

	const originalPrice =
		typeof course.price === "string"
			? parseFloat(course.price)
			: typeof course.price === "number"
				? course.price
				: 0;

	const discountPercentage = Math.round(
		(((originalPrice || 0) - (Number(offerPrice) || 0)) /
			(originalPrice || 1)) *
			100,
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="flex flex-col sm:flex-row gap-4 p-4 bg-[var(--color-background)] rounded-lg transition-all duration-300"
		>
			<Image
				src={course.thumbnail}
				alt={course.title}
				className="w-full sm:w-32 sm:h-20 object-cover rounded bg-[var(--color-background)] flex-shrink-0"
				width={128}
				height={80}
			/>

			<div className="flex-1 space-y-3">
				<div className="flex justify-between items-start">
					<div className="flex-1 space-y-1">
						<h3 className="text-base sm:text-lg font-semibold text-[var(--color-primary-dark)] leading-tight">
							{course.title}
						</h3>
						<p className="text-sm text-[var(--color-muted)]">
							{course.creator?.name}
						</p>
					</div>
					<button
						onClick={() => course.id && onRemove(course.id)}
						className="p-2 text-[var(--color-danger)]/70 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ml-4"
						title="Remove from cart"
						disabled={isRemoving}
					>
						<Trash2 size={18} />
					</button>
				</div>

				<div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
					<span className="flex items-center gap-1">
						<Clock size={14} className="text-[var(--color-primary-light)]" />
						{course.duration}
					</span>
					<span className="flex items-center gap-1">
						<BookOpen size={14} className="text-[var(--color-primary-light)]" />
						{course.lectures || 0} lectures
					</span>
					<span className="flex items-center gap-1">
						<Award size={14} className="text-[var(--color-primary-dark)]" />
						{course.level}
					</span>
				</div>

				<div className="flex items-center justify-between sm:justify-start gap-4">
					<div className="flex items-center gap-3">
						<div className="text-lg font-bold text-[var(--color-primary-light)]">
							${Number(offerPrice || 0).toFixed(2)}
						</div>
						{discountPercentage > 0 && (
							<div className="text-sm text-[var(--color-muted)] line-through">
								${originalPrice.toFixed(2)}
							</div>
						)}
					</div>
					{discountPercentage > 0 && (
						<div className="bg-[var(--color-danger)]/10 text-[var(--color-danger)] px-2 py-1 rounded text-xs font-medium">
							{discountPercentage}% OFF
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
}
