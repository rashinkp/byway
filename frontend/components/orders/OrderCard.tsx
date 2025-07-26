import React from "react";
import { RefreshCw, Calendar, DollarSign, BookOpen } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Order } from "@/types/order";
import { formatDate, formatPrice } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { useRetryOrder } from "@/hooks/order/useRetryOrder";
import Image from "next/image";

interface OrderCardProps {
	order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
	const { mutate: retryOrder, isPending: isRetrying } = useRetryOrder();

	const handleRetry = () => {
		retryOrder(order.id);
	};

	return (
		<div className="bg-white dark:bg-[#232323] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
			{/* Header Section */}
			<div className="bg-gradient-to-r from-[#facc15]/10 to-[#facc15]/5 dark:from-[#facc15]/20 dark:to-[#facc15]/10 p-6 border-b border-gray-200 dark:border-gray-700">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-[#facc15] rounded-lg flex items-center justify-center">
							<BookOpen className="w-5 h-5 text-black" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-black dark:text-white">
								Order #{order.id.slice(0, 8).toUpperCase()}
							</h3>
							<div className="flex items-center gap-2 mt-1">
								<Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
								<p className="text-sm text-gray-600 dark:text-gray-300">
									{formatDate(order.createdAt)}
								</p>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<StatusBadge status={order.paymentStatus} type="payment" />
						{order.paymentStatus === "FAILED" && (
							<Button
								variant="secondary"
								size="sm"
								onClick={handleRetry}
								disabled={isRetrying}
								className="border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black dark:border-[#facc15] dark:text-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black"
							>
								{isRetrying ? (
									<>
										<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
										Retrying...
									</>
								) : (
									<>
										<RefreshCw className="w-4 h-4 mr-2" />
										Retry Payment
									</>
								)}
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Course Items Section */}
			<div className="p-6">
				<div className="space-y-4">
					{order.items.map((item, index) => (
						<div
							key={item.orderId}
							className={`flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700 ${
								index !== order.items.length - 1 ? "mb-4" : ""
							}`}
						>
							{/* Course Image */}
							<div className="flex-shrink-0">
								<div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
									<Image
										src={item.thumbnail || "/placeholder-course.jpg"}
										alt={item.title}
										className="w-full h-full object-cover"
										width={80}
										height={80}
									/>
								</div>
							</div>

							{/* Course Details */}
							<div className="flex-1 min-w-0">
								<h4 className="text-lg font-semibold text-black dark:text-white mb-2 line-clamp-2">
									{item.title}
								</h4>
								<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
									<span className="flex items-center gap-1">
										<span className="w-2 h-2 bg-[#facc15] rounded-full"></span>
										Level: {item.level}
									</span>
									<span className="flex items-center gap-1">
										<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
										{item.approvalStatus === "APPROVED" ? "Approved" : "Pending Approval"}
									</span>
								</div>
							</div>

							{/* Price Section */}
							<div className="flex-shrink-0 text-right">
								<div className="flex flex-col items-end gap-1">
									{Number(item.discount) > 0 && (
										<span className="text-xs text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
											-{item.discount}% OFF
										</span>
									)}
									<div className="flex items-center gap-2">
										{Number(item.discount) > 0 && (
											<span className="text-sm text-gray-500 dark:text-gray-400 line-through">
												{formatPrice(item.price || 0)}
											</span>
										)}
										<span className="text-lg font-bold text-[#facc15]">
											{formatPrice(item.coursePrice)}
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Footer Section */}
			<div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-t border-gray-200 dark:border-gray-700">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="flex items-center gap-2">
						<DollarSign className="w-5 h-5 text-[#facc15]" />
						<span className="text-sm text-gray-600 dark:text-gray-300">Total Amount</span>
					</div>
					<div className="text-right">
						<p className="text-2xl font-bold text-[#facc15]">
							{formatPrice(order.amount)}
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{order.items.length} course{order.items.length !== 1 ? 's' : ''}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
