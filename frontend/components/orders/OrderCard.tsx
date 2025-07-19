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
		<div className="bg-[var(--color-background)]  rounded-lg overflow-hidden">
			<div className="p-4 ">
				<div className="flex justify-between items-start">
					<div>
						<h3 className="text-sm font-medium text-[var(--color-primary-dark)]">
							Order #{order.id.slice(0, 8)}
						</h3>
						<p className="text-sm text-[var(--color-muted)] mt-1">
							{formatDate(order.createdAt)}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<StatusBadge status={order.paymentStatus} type="payment" />
						{order.paymentStatus === "FAILED" && (
							<Button
								variant="secondary"
								size="sm"
								onClick={handleRetry}
								disabled={isRetrying}
								className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
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
						className="p-4 flex items-start justify-between"
					>
						<div className="flex gap-4">
							<div className="w-16 h-16 flex-shrink-0">
								<Image
									src={item.thumbnail || "/placeholder-course.jpg"}
									alt={item.title}
									className="w-full h-full object-cover rounded-md"
									width={100}
									height={100}
								/>
							</div>
							<div>
								<h4 className="text-sm font-medium text-[var(--color-primary-dark)]">
									{item.title}
								</h4>
								<p className="text-xs text-[var(--color-muted)] mt-1">
									Level: {item.level}
								</p>
								<div className="mt-2 flex items-center gap-2">
									<span className="text-sm text-[var(--color-muted)] line-through">
										{formatPrice(item.price || 0)}
									</span>
									<span className="text-sm font-medium text-[--color-primary-dark]">
										{formatPrice(item.coursePrice)}
									</span>
									{item.discount && item.discount > 0 && (
										<span className="text-xs text-[--color-danger] font-medium">
											(-{item.discount}%)
										</span>
									)}
								</div>
							</div>
						</div>
						<div className="text-right">
							<p className="text-sm font-medium text-[var(--color-primary-dark)]">
								{formatPrice(item.coursePrice)}
							</p>
							<p className="text-xs text-[var(--color-muted)] mt-1">
								{item.approvalStatus === "APPROVED"
									? "Approved"
									: "Pending Approval"}
							</p>
						</div>
					</div>
				))}
			</div>

			<div className="p-4 bg-[var(--color-background)] ">
				<div className="flex justify-between items-center">
					<div>
						<p className="text-sm text-[var(--color-muted)]">Total Amount</p>
						<p className="text-lg font-semibold text-[var(--color-primary-dark)]">
							{formatPrice(order.amount)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
