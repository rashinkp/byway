"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TableSkeleton } from "@/components/skeleton/DataTableSkeleton";
import { Column, Action } from "@/types/common";

interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	isLoading?: boolean;
	onRowClick?: (item: T) => void;
	actions?: Action<T>[];
	itemsPerPage?: number;
	totalItems?: number;
	currentPage?: number;
	setCurrentPage?: (page: number) => void;
	actionLoading?: boolean;
}

export function DataTable<T>({
	data,
	columns,
	isLoading = false,
	onRowClick,
	actions = [],
	actionLoading = false,
}: DataTableProps<T>) {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmItem, setConfirmItem] = useState<T | null>(null);
	const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
	const [confirmActionIndex, setConfirmActionIndex] = useState<number | null>(
		null,
	);

	const paginatedData = data;

	const handleActionClick = (
		item: T,
		action: Action<T>,
		actionIndex: number,
	) => {
		if (action.confirmationMessage) {
			setConfirmItem(item);
			setConfirmAction(() => () => action.onClick(item));
			setConfirmActionIndex(actionIndex);
			setConfirmOpen(true);
		} else {
			action.onClick(item);
		}
	};

	const handleConfirm = () => {
		if (confirmAction) {
			confirmAction();
		}
	
	};

	const rowVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
		exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
	};

	return (
		<div className="space-y-4">
			<div className="backdrop-blur-sm rounded-xl shadow-sm overflow-hidden">
				{isLoading ? (
					<TableSkeleton
						columns={columns.length}
						hasActions={actions.length > 0}
					/>
				) : (
					<Table>
						<TableHeader>
							<TableRow className="">
								{columns.map((column, index) => (
									<TableHead
										key={index}
										className="text-black dark:text-[#facc15] font-semibold text-sm tracking-tight py-4 px-6"
									>
										{column.header}
									</TableHead>
								))}
								{actions.length > 0 && (
									<TableHead className="text-black dark:text-[#facc15] font-semibold text-sm tracking-tight py-4 px-6">
										Actions
									</TableHead>
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							<AnimatePresence>
								{paginatedData.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
											className="text-center text-[var(--color-muted)] py-12"
										>
											<div className="flex flex-col items-center space-y-2">
												<div className="text-[var(--color-muted)] text-lg">
													No data found
												</div>
												<div className="text-sm text-[var(--color-muted)]">
													Try adjusting your search or filters
												</div>
											</div>
										</TableCell>
									</TableRow>
								) : (
									paginatedData.map((item, index) => (
										<motion.tr
											key={index}
											variants={rowVariants}
											initial="hidden"
											animate="visible"
											exit="exit"
											className={`
                        transition-all duration-200
                        hover:bg-[var(--color-surface)]/80 hover:shadow-sm
                        ${onRowClick ? "cursor-pointer" : ""}
                      `}
											onClick={() => onRowClick?.(item)}
										>
											{columns.map((column, colIndex) => (
												<TableCell
													key={colIndex}
													className="text-black dark:text-white text-sm py-4 px-6 max-w-xs truncate"
													title={
														column.render
															? undefined
															: String(item[column.accessor as keyof T])
													}
												>
													{column.render ? (
														column.render(item)
													) : (
														<span className="block truncate">
															{
																item[
																column.accessor as keyof T
																] as React.ReactNode
															}
														</span>
													)}
												</TableCell>
											))}
											{actions.length > 0 && (
												<TableCell className="py-4 px-6">
													<div className="flex space-x-2">
														{actions.map((action, actionIndex) => {
															const label =
																typeof action.label === "function"
																	? action.label(item)
																	: action.label;
															const variant =
																typeof action.variant === "function"
																	? action.variant(item)
																	: action.variant || "outline";

															return (
																<Button
																	key={actionIndex}
																	variant={variant === "default" ? "default" : "secondary"}
																	size="sm"
																	className={`
                                    relative
                                    text-xs font-medium
                                    rounded-lg
                                    transition-all duration-200
                                    hover:scale-105 hover:shadow-md
                                    ${variant === "destructive"
                                        ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 border-red-200 dark:border-red-700"
                                        : variant === "default"
                                            ? "bg-[#facc15]/10 text-[#facc15] dark:hover:text-white hover:bg-[#facc15]/20 border-[#facc15]/30 dark:bg-[#232323] dark:text-[#facc15] dark:hover:bg-[#facc15]/20 dark:border-[#facc15]"
                                            : "bg-white/80 text-black dark:bg-[#232323] dark:text-white hover:dark:text-white border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#232323]"
                                    }
                                  `}
																	onClick={(e) => {
																		e.stopPropagation();
																		handleActionClick(
																			item,
																			action,
																			actionIndex,
																		);
																	}}
																>
																	{action.Icon && (
																		<action.Icon className="h-4 w-4 mr-1" />
																	)}
																	{label}
																</Button>
															);
														})}
													</div>
												</TableCell>
											)}
										</motion.tr>
									))
								)}
							</AnimatePresence>
						</TableBody>
					</Table>
				)}
			</div>

			<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							{confirmItem && confirmActionIndex !== null
								? actions[confirmActionIndex]?.confirmationMessage?.(
									confirmItem,
								) || "Are you sure you want to perform this action?"
								: "Are you sure you want to perform this action?"}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
						<AlertDialogAction 
							onClick={handleConfirm}
							disabled={actionLoading}
							className="relative"
						>
							{actionLoading ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
									Processing...
								</>
							) : (
								"Confirm"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
