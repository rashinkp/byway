"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DollarSign,
	Users,
	User,
	Loader2,
	Clock,
	Search,
	ChevronLeft,
	ChevronRight,
	Info,
	Target,
	Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import React from "react";

// Separate SearchInput component to prevent re-renders
const SearchInput = React.memo(
	({
		value,
		onChange,
		isLoading,
		placeholder,
	}: {
		value: string;
		onChange: (value: string) => void;
		isLoading: boolean;
		placeholder: string;
	}) => {
		return (
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
				<Input
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="pl-10 w-full sm:w-64"
					disabled={isLoading}
				/>
				{isLoading && (
					<Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
				)}
			</div>
		);
	},
);

SearchInput.displayName = "SearchInput";

interface LatestRevenueListProps {
	latestData:
		| {
				data: {
					items: any[];
					total: number;
					page: number;
					limit: number;
					totalPages: number;
				};
		  }
		| null
		| undefined;
	isLoading: boolean;
	onSearchChange: (search: string) => void;
	onSortChange: (sortBy: "latest" | "oldest") => void;
	onPageChange: (page: number) => void;
	currentSort: "latest" | "oldest";
	currentPage: number;
	searchValue: string;
}

export default function LatestRevenueList({
	latestData,
	isLoading,
	onSearchChange,
	onSortChange,
	onPageChange,
	currentSort,
	currentPage,
	searchValue,
}: LatestRevenueListProps) {
	const [searchInput, setSearchInput] = useState(searchValue);
	const debouncedSearch = useDebounce(searchInput, 500);
	const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Update parent when debounced search changes
	useEffect(() => {
		onSearchChange(debouncedSearch);
	}, [debouncedSearch, onSearchChange]);

	const handleSearchInputChange = useCallback((searchTerm: string) => {
		setSearchInput(searchTerm);
	}, []);

	const handleTransactionClick = useCallback((transaction: any) => {
		setSelectedTransaction(transaction);
		setIsModalOpen(true);
	}, []);

	// Memoize computed values
	const totalPages = useMemo(
		() => latestData?.data?.totalPages || 1,
		[latestData?.data?.totalPages],
	);
	const totalItems = useMemo(
		() => latestData?.data?.total || 0,
		[latestData?.data?.total],
	);
	const latestItems = useMemo(
		() => latestData?.data?.items || [],
		[latestData?.data?.items],
	);

	// Memoize search input props
	const searchInputProps = useMemo(
		() => ({
			value: searchInput,
			onChange: handleSearchInputChange,
			isLoading,
			placeholder: "Search courses, creators, customers...",
		}),
		[searchInput, handleSearchInputChange, isLoading],
	);

	const formatCurrency = (amount: number) => {
		if (typeof amount !== "number" || isNaN(amount)) return "$0.00";
		const truncatedAmount = Math.floor(amount * 100) / 100;
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
			useGrouping: true,
		}).format(truncatedAmount);
	};

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), "MMM d, yyyy");
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
				<div className="flex items-center gap-3">
					<div className="bg-blue-50 p-2 rounded-lg">
						<Clock className="w-5 h-5 text-blue-600" />
					</div>
					<div>
						<h2 className="text-lg font-semibold text-gray-900">
							Latest Revenue Transactions
						</h2>
						<p className="text-sm text-gray-600">
							Recent financial activities and revenue streams
						</p>
					</div>
				</div>

				{/* Search and Sort Controls */}
				<div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
					<SearchInput {...searchInputProps} />

					<div className="flex gap-2">
						<Button
							variant={currentSort === "latest" ? "default" : "outline"}
							size="sm"
							onClick={() => onSortChange("latest")}
						>
							Latest
						</Button>
						<Button
							variant={currentSort === "oldest" ? "default" : "outline"}
							size="sm"
							onClick={() => onSortChange("oldest")}
						>
							Oldest
						</Button>
					</div>
				</div>
			</div>

			<Separator />

			{/* Transactions List */}
			<div className="space-y-4">
				{latestItems.map((item: any) => (
					<div
						key={item.orderId}
						className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:bg-white/80 hover:shadow-sm transition-all duration-200"
					>
						<div className="flex items-center justify-between">
							{/* Left side - Essential Info */}
							<div className="flex items-center space-x-4 flex-1">
								<div className="bg-green-100 p-2 rounded-lg">
									<DollarSign className="w-5 h-5 text-green-600" />
								</div>

								<div className="flex-1">
									<div className="flex items-center space-x-2 mb-2">
										<h4 className="font-semibold text-gray-900">
											{item.courseTitle}
										</h4>
										<button
											onClick={() => handleTransactionClick(item)}
											className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50"
										>
											<Info className="w-4 h-4" />
										</button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
										<div className="flex items-center space-x-2">
											<User className="w-4 h-4 text-blue-500" />
											<div>
												<span className="text-gray-600">Instructor:</span>
												<span className="ml-1 font-medium text-gray-900">
													{item.creatorName}
												</span>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Users className="w-4 h-4 text-purple-500" />
											<div>
												<span className="text-gray-600">Customer:</span>
												<span className="ml-1 font-medium text-gray-900">
													{item.customerName}
												</span>
											</div>
										</div>
										<div>
											<span className="text-gray-600">Offer Price:</span>
											<span className="ml-1 font-medium text-gray-900">
												{formatCurrency(item.offerPrice)}
											</span>
										</div>
										<div>
											<span className="text-gray-600">Admin Share:</span>
											<span className="ml-1 font-medium text-gray-900">
												{item.adminSharePercentage}%
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Right side - Revenue */}
							<div className="text-right">
								<div className="text-xl font-bold text-green-600">
									{formatCurrency(item.transactionAmount)}
								</div>
								<div className="text-sm text-gray-500">
									{formatDate(item.createdAt)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Pagination */}
			{totalItems >= 10 && (
				<div className="flex items-center justify-between pt-6 border-t border-gray-200">
					<div className="text-sm text-gray-500">
						Showing {(currentPage - 1) * 10 + 1} to{" "}
						{Math.min(currentPage * 10, totalItems)} of {totalItems} results
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(currentPage - 1)}
							disabled={currentPage <= 1}
						>
							<ChevronLeft className="w-4 h-4 mr-1" />
							Previous
						</Button>

						<div className="flex items-center gap-1">
							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								const pageNum = i + 1;
								return (
									<Button
										key={pageNum}
										variant={pageNum === currentPage ? "default" : "outline"}
										size="sm"
										onClick={() => onPageChange(pageNum)}
										className="w-8 h-8 p-0"
									>
										{pageNum}
									</Button>
								);
							})}
						</div>

						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(currentPage + 1)}
							disabled={currentPage >= totalPages}
						>
							Next
							<ChevronRight className="w-4 h-4 ml-1" />
						</Button>
					</div>
				</div>
			)}

			{/* Detailed Transaction Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle className="flex items-center space-x-2">
							<div className="bg-blue-50 p-2 rounded-lg">
								<Info className="w-5 h-5 text-blue-500" />
							</div>
							<span>Transaction Details</span>
						</DialogTitle>
					</DialogHeader>

					{selectedTransaction && (
						<div className="space-y-6">
							{/* Header */}
							<div className="text-center space-y-2">
								<h3 className="text-xl font-semibold text-gray-900">
									{selectedTransaction.courseTitle}
								</h3>
								<p className="text-sm text-gray-500">
									Order ID: {selectedTransaction.orderId}
								</p>
							</div>

							<Separator />

							{/* Course Information */}
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<Target className="w-4 h-4 text-blue-500" />
									<h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
										Course Information
									</h4>
								</div>
								<div className="space-y-2 ml-6">
									<div className="flex justify-between">
										<span className="text-gray-600">Course Price:</span>
										<span className="font-medium">
											{formatCurrency(selectedTransaction.coursePrice)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Offer Price:</span>
										<span className="font-medium">
											{formatCurrency(selectedTransaction.offerPrice)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Admin Share:</span>
										<span className="font-medium">
											{selectedTransaction.adminSharePercentage}%
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Admin Share:</span>
										<span className="font-medium">
											{formatCurrency(selectedTransaction.transactionAmount)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Instructor Share:</span>
										<span className="font-medium">
											{100 - selectedTransaction.adminSharePercentage}%
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Instructor Revenue:</span>
										<span className="font-medium">
											{formatCurrency(
												selectedTransaction.offerPrice *
													((100 - selectedTransaction.adminSharePercentage) /
														100),
											)}
										</span>
									</div>
								</div>
							</div>

							<Separator />

							{/* Participants */}
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<Users className="w-4 h-4 text-purple-500" />
									<h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
										Participants
									</h4>
								</div>
								<div className="space-y-3 ml-6">
									<div className="flex items-center space-x-3">
										<User className="w-4 h-4 text-blue-500" />
										<div>
											<div className="text-sm text-gray-600">Instructor</div>
											<div className="font-medium text-gray-900">
												{selectedTransaction.creatorName}
											</div>
										</div>
									</div>
									<div className="flex items-center space-x-3">
										<Users className="w-4 h-4 text-purple-500" />
										<div>
											<div className="text-sm text-gray-600">Customer</div>
											<div className="font-medium text-gray-900">
												{selectedTransaction.customerName}
											</div>
											<div className="text-sm text-gray-500">
												{selectedTransaction.customerEmail}
											</div>
										</div>
									</div>
								</div>
							</div>

							<Separator />

							{/* Transaction Details */}
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4 text-gray-500" />
									<h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
										Transaction Details
									</h4>
								</div>
								<div className="space-y-2 ml-6">
									<div className="flex justify-between">
										<span className="text-gray-600">Date:</span>
										<span className="font-medium">
											{formatDate(selectedTransaction.createdAt)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Course ID:</span>
										<span className="text-sm text-gray-900">
											{selectedTransaction.courseId}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Transaction Amount:</span>
										<span className="font-medium text-green-600">
											{formatCurrency(selectedTransaction.transactionAmount)}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
