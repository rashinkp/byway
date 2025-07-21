"use client";

import React, { useState, useEffect } from "react";
import {
	CreditCard,
} from "lucide-react";
import { OrderCard } from "@/components/orders/OrderCard";
import { useOrders } from "@/hooks/order/useOrders";
import { Pagination } from "@/components/ui/Pagination";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersSection() {
	const [currentPage, setCurrentPage] = useState(1);
	const [ordersPerPage] = useState(10);
	const { orders, isLoading, error, fetchOrders } = useOrders();

	useEffect(() => {
		fetchOrders({
			page: currentPage,
			limit: ordersPerPage,
			sortBy: "createdAt",
			sortOrder: "desc",
		});
	}, [fetchOrders, currentPage, ordersPerPage]);

	if (isLoading) {
		return (
			<div className="w-full">
				<div className="bg-[var(--color-background)] rounded-xl  p-6 mb-8">
					<h1 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-2">
						My Orders
					</h1>
					<p className="text-[var(--color-muted)]">
						Track your course purchases and enrollments
					</p>
				</div>
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-32 w-full rounded-lg" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="bg-white dark:bg-[#232326] rounded-xl p-8 mb-8 text-center">
				<h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">My Orders</h1>
				<p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
					Track your course purchases and enrollments.
				</p>
			</div>

			{error && (
				<ErrorDisplay
					error={error}
					onRetry={fetchOrders}
					title="Order Error"
					description="There was a problem loading your orders. Please try again."
				/>
			)}

			{!orders || !orders.orders?.length ? (
				<div className="text-center py-12">
					<div className="w-24 h-24 mx-auto mb-4 text-[var(--color-muted)]">
						<CreditCard className="w-full h-full" />
					</div>
					<h3 className="text-lg font-medium text-[var(--color-primary-dark)]">
						No orders found
					</h3>
					<p className="mt-2 text-sm text-[var(--color-muted)]">
						You haven&#39;t placed any orders yet.
					</p>
				</div>
			) : (
				<div className="p-6">
					<div className="space-y-6">
						{orders.orders.map((order) => (
							<OrderCard key={order.id} order={order} />
						))}
					</div>
					{orders.totalPages > 1 && (
						<div className="mt-8 flex justify-center">
							<Pagination
								currentPage={currentPage}
								totalPages={orders.totalPages}
								onPageChange={setCurrentPage}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
