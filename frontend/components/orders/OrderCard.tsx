import React from "react";
import { RefreshCw } from "lucide-react";
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
		<div className="bg-white dark:bg-[#232326] rounded-lg overflow-hidden">
			<div className="p-4 ">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
					<div>
						<h3 className="text-sm font-medium text-yellow-500">
							Order #{order.id.slice(0, 8)}
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
							{formatDate(order.createdAt)}
						</p>
					</div>
					<div className="flex items-center gap-2 mt-2 sm:mt-0">
						<StatusBadge status={order.paymentStatus} type="payment" />
						{order.paymentStatus === "FAILED" && (
							<Button
								variant="secondary"
								size="sm"
								onClick={handleRetry}
								disabled={isRetrying}
								className="text-yellow-500 hover:text-yellow-600"
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

			<div className="divide-y ">
				{order.items.map((item) => (
					<div
						key={item.orderId}
						className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
					>
						<div className="flex flex-col xs:flex-row gap-4 w-full md:w-auto">
							<div className="w-24 h-24 md:w-16 md:h-16 flex-shrink-0 mx-auto xs:mx-0">
								<Image
									src={item.thumbnail || "/placeholder-course.jpg"}
									alt={item.title}
									className="w-full h-full object-cover rounded-md"
									width={100}
									height={100}
								/>
							</div>
							<div className="flex-1 min-w-0">
								<h4 className="text-sm font-medium text-yellow-500 truncate">
									{item.title}
								</h4>
								<p className="text-xs text-gray-500 dark:text-gray-300 mt-1 truncate">
									Level: {item.level}
								</p>
								<div className="mt-2 flex flex-wrap items-center gap-2">
									<span className="text-sm text-gray-500 dark:text-gray-300 line-through">
										{formatPrice(item.price || 0)}
									</span>
									<span className="text-sm font-medium text-yellow-500">
										{formatPrice(item.coursePrice)}
									</span>
									{item.discount && item.discount > 0 && (
										<span className="text-xs text-red-500 dark:text-red-400 font-medium">
											(-{item.discount}%)
										</span>
									)}
								</div>
							</div>
						</div>
						<div className="text-right mt-4 md:mt-0 md:text-right min-w-[100px]">
							<p className="text-sm font-medium text-yellow-500">
								{formatPrice(item.coursePrice)}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
								{item.approvalStatus === "APPROVED"
									? "Approved"
									: "Pending Approval"}
							</p>
						</div>
					</div>
				))}
			</div>

			<div className="p-4 bg-white dark:bg-[#232326] ">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
					<div>
						<p className="text-sm text-gray-500 dark:text-gray-300">Total Amount</p>
						<p className="text-lg font-semibold text-yellow-500">
							{formatPrice(order.amount)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
