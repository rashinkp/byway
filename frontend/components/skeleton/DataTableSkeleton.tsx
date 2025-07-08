import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
	columns: number; // Number of columns (including actions)
	rows?: number; // Number of placeholder rows
	hasActions?: boolean; // Whether to include an actions column
}

export function TableSkeleton({
	columns,
	rows = 5,
	hasActions = true,
}: TableSkeletonProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow className="bg-[var(--color-surface)]/50">
					{[...Array(columns - (hasActions ? 1 : 0))].map((_, i) => (
						<TableHead key={i}>
							<Skeleton className="h-6 w-24" />
						</TableHead>
					))}
					{hasActions && (
						<TableHead>
							<Skeleton className="h-6 w-16" />
						</TableHead>
					)}
				</TableRow>
			</TableHeader>
			<TableBody>
				{[...Array(rows)].map((_, rowIndex) => (
					<TableRow key={rowIndex} className="border-b border-[var(--color-muted)]/20">
						{[...Array(columns - (hasActions ? 1 : 0))].map((_, colIndex) => (
							<TableCell key={colIndex}>
								<Skeleton className="h-6 w-full" />
							</TableCell>
						))}
						{hasActions && (
							<TableCell>
								<Skeleton className="h-8 w-20" />
							</TableCell>
						)}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
