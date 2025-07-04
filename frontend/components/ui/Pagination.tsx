import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
	const maxVisiblePages = 5;
	const halfVisible = Math.floor(maxVisiblePages / 2);

	let visiblePages = pages;
	if (totalPages > maxVisiblePages) {
		const start = Math.max(currentPage - halfVisible, 1);
		const end = Math.min(start + maxVisiblePages - 1, totalPages);
		visiblePages = pages.slice(start - 1, end);
	}

	return (
		<div className="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="bg-[var(--color-surface)] border border-[var(--color-background)] text-[var(--color-muted)] hover:bg-[var(--color-background)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<ChevronLeft className="h-4 w-4 mr-1" />
				Previous
			</Button>

			{visiblePages.map((page) => (
				<Button
					key={page}
					variant={currentPage === page ? "default" : "outline"}
					size="sm"
					onClick={() => onPageChange(page)}
					className={`
            w-10 h-10 p-0
            ${
							currentPage === page
								? "bg-[var(--color-primary-dark)] text-[var(--color-surface)] hover:bg-[var(--color-primary-light)]"
								: "bg-[var(--color-surface)] border border-[var(--color-background)] text-[var(--color-primary-dark)] hover:bg-[var(--color-background)] transition-all duration-200"
						}
          `}
				>
					{page}
				</Button>
			))}

			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="bg-[var(--color-surface)] border border-[var(--color-background)] text-[var(--color-muted)] hover:bg-[var(--color-background)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Next
				<ChevronRight className="h-4 w-4 ml-1" />
			</Button>
		</div>
	);
}
