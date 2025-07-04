import { useState } from "react";
import { Star, MoreVertical, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { CourseReview } from "@/types/course-review";
import { formatDistanceToNow } from "date-fns";

interface ReviewItemProps {
	review: CourseReview;
	isOwner: boolean;
	onEdit: () => void;
	onDelete: () => void;
	onDisable?: () => void;
	isDeleting: boolean;
	isDisabling?: boolean;
	userRole?: "USER" | "ADMIN" | "INSTRUCTOR";
	isDisabled?: boolean;
}

export default function ReviewItem({
	review,
	isOwner,
	onEdit,
	onDelete,
	onDisable,
	isDeleting,
	isDisabling = false,
	userRole = "USER",
	isDisabled = false,
}: ReviewItemProps) {
	const [showMenu, setShowMenu] = useState(false);

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`w-4 h-4 ${
					i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
				}`}
			/>
		));
	};

	const formatDate = (date: Date) => {
		return formatDistanceToNow(new Date(date), { addSuffix: true });
	};

	// Determine if user can perform actions
	const canEdit = userRole === "USER" && isOwner;
	const canDelete = userRole === "USER" && isOwner; // Only creator can delete
	const canDisable = userRole === "ADMIN" && onDisable;
	const showActions = canEdit || canDelete || canDisable;

	return (
		<div className={`relative ${isDisabled ? "opacity-60" : ""}`}>
			{/* User Info and Rating */}
			<div className="flex items-start space-x-4">
				{/* Avatar */}
				<div className="flex-shrink-0">
					<div className="w-10 h-10 bg-[var(--color-primary-light)]/10 rounded-full flex items-center justify-center">
						<span className="text-[var(--color-primary-light)] font-semibold text-sm">
							{review.user?.name?.charAt(0).toUpperCase() || "U"}
						</span>
					</div>
				</div>

				{/* Review Content */}
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="flex items-center space-x-2">
								<h4 className="text-sm font-semibold text-[var(--color-primary-dark)]">
									{review.user?.name || "Anonymous"}
								</h4>
								<div className="flex items-center space-x-1">
									{renderStars(review.rating)}
								</div>
								{isDisabled && (
									<span className="text-xs bg-[var(--color-danger)]/10 text-[var(--color-danger)] px-2 py-1 rounded">
										Disabled
									</span>
								)}
								{userRole === "ADMIN" && !isDisabled && (
									<span className="text-xs bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] px-2 py-1 rounded">
										Enabled
									</span>
								)}
							</div>

							{review.title && (
								<h5 className="text-sm font-medium text-[var(--color-primary-dark)] mt-1">
									{review.title}
								</h5>
							)}

							{review.comment && (
								<p className="text-sm text-[var(--color-muted)] mt-2 leading-relaxed">
									{review.comment}
								</p>
							)}

							<p className="text-xs text-[var(--color-muted)] mt-2">
								{formatDate(review.createdAt)}
							</p>
						</div>

						{/* Actions Menu */}
						{showActions && (
							<div className="relative">
								<button
									onClick={() => setShowMenu(!showMenu)}
									className="p-1 text-[var(--color-muted)] hover:text-[var(--color-primary-dark)] transition-colors"
								>
									<MoreVertical className="w-4 h-4" />
								</button>

								{showMenu && (
									<div className="absolute right-0 top-8 w-40 bg-[var(--color-surface)] border border-[var(--color-primary-light)]/20 rounded-lg shadow-lg z-10">
										{canEdit && (
											<button
												onClick={() => {
													onEdit();
													setShowMenu(false);
												}}
												className="w-full px-3 py-2 text-left text-sm text-[var(--color-primary-dark)] hover:bg-[var(--color-background)] flex items-center space-x-2"
											>
												<Edit className="w-4 h-4" />
												<span>Edit</span>
											</button>
										)}
										{canDisable && (
											<button
												onClick={() => {
													onDisable?.();
													setShowMenu(false);
												}}
												disabled={isDisabling}
												className="w-full px-3 py-2 text-left text-sm text-[var(--color-warning)] hover:bg-[var(--color-warning)]/10 flex items-center space-x-2 disabled:opacity-50"
											>
												{isDisabled ? (
													<>
														<Eye className="w-4 h-4" />
														<span>
															{isDisabling ? "Enabling..." : "Enable"}
														</span>
													</>
												) : (
													<>
														<EyeOff className="w-4 h-4" />
														<span>
															{isDisabling ? "Disabling..." : "Disable"}
														</span>
													</>
												)}
											</button>
										)}
										{canDelete && (
											<button
												onClick={() => {
													onDelete();
													setShowMenu(false);
												}}
												disabled={isDeleting}
												className="w-full px-3 py-2 text-left text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 flex items-center space-x-2 disabled:opacity-50"
											>
												<Trash2 className="w-4 h-4" />
												<span>{isDeleting ? "Deleting..." : "Delete"}</span>
											</button>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Click outside to close menu */}
			{showMenu && (
				<div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />
			)}
		</div>
	);
}
