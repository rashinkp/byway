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
}

export function DataTable<T>({
	data,
	columns,
	isLoading = false,
	onRowClick,
	actions = [],
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
		setConfirmOpen(false);
		setConfirmItem(null);
		setConfirmAction(null);
		setConfirmActionIndex(null);
	};

	const rowVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
		exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
	};

	return (
		<div className="space-y-4">
			<div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm overflow-hidden">
				{isLoading ? (
					<TableSkeleton
						columns={columns.length}
						hasActions={actions.length > 0}
					/>
				) : (
					<Table>
						<TableHeader>
							<TableRow className="bg-gray-50/50 border-b border-gray-200/50 hover:bg-gray-50/70 transition-colors">
								{columns.map((column, index) => (
									<TableHead
										key={index}
										className="text-gray-600 font-semibold text-sm tracking-tight py-4 px-6"
									>
										{column.header}
									</TableHead>
								))}
								{actions.length > 0 && (
									<TableHead className="text-gray-600 font-semibold text-sm tracking-tight py-4 px-6">
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
											className="text-center text-gray-500 py-12"
										>
											<div className="flex flex-col items-center space-y-2">
												<div className="text-gray-400 text-lg">
													No data found
												</div>
												<div className="text-sm">
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
                        border-b border-gray-200/50
                        transition-all duration-200
                        hover:bg-white/80 hover:shadow-sm
                        ${onRowClick ? "cursor-pointer" : ""}
                      `}
											onClick={() => onRowClick?.(item)}
										>
											{columns.map((column, colIndex) => (
												<TableCell
													key={colIndex}
													className="text-gray-800 text-sm py-4 px-6 max-w-xs truncate"
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
																	variant={variant}
																	size="sm"
																	className={`
                                    relative
                                    text-xs font-medium
                                    rounded-lg
                                    transition-all duration-200
                                    hover:scale-105 hover:shadow-md
                                    ${
																			variant === "destructive"
																				? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
																				: variant === "default"
																					? "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
																					: "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
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
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirm}>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
