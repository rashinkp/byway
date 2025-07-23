"use client";

import { DollarSign, ArrowUpRight, Calendar, Activity } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface RevenueOverviewCardsProps {
	overallData: {
		data: {
			totalRevenue: number;
			refundedAmount: number;
			netRevenue: number;
			coursesSold: number;
		};
	} | null;
	dateRange: DateRange;
}

export default function RevenueOverviewCards({
	overallData,
	dateRange,
}: RevenueOverviewCardsProps) {
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

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:bg-white transition-all duration-200 dark:bg-[#232323] dark:border-gray-700 dark:hover:bg-[#232323]">
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<p className="text-sm font-medium text-gray-500 uppercase tracking-wide dark:text-gray-300">
							Total Revenue
						</p>
						<h3 className="text-2xl font-semibold text-black dark:text-white">
							{formatCurrency(overallData?.data?.totalRevenue || 0)}
						</h3>
						<div className="flex items-center text-[#facc15] dark:text-[#facc15]">
							<ArrowUpRight className="w-4 h-4 mr-1" />
							<span className="text-sm">
								Net: {formatCurrency(overallData?.data?.netRevenue || 0)}
							</span>
						</div>
					</div>
					<div className="bg-[#facc15] p-3 rounded-lg dark:bg-[#18181b]">
						<DollarSign className="w-6 h-6 text-black dark:text-[#facc15]" />
					</div>
				</div>
			</div>

			<div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:bg-white transition-all duration-200 dark:bg-[#232323] dark:border-gray-700 dark:hover:bg-[#232323]">
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<p className="text-sm font-medium text-gray-500 uppercase tracking-wide dark:text-gray-300">
							Courses Sold
						</p>
						<h3 className="text-2xl font-semibold text-black dark:text-white">
							{overallData?.data?.coursesSold ?? 0}
						</h3>
						<div className="text-sm text-gray-500 dark:text-gray-300">In selected period</div>
					</div>
					<div className="bg-[#facc15] p-3 rounded-lg dark:bg-[#18181b]">
						<Activity className="w-6 h-6 text-black dark:text-[#facc15]" />
					</div>
				</div>
			</div>

			<div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:bg-white transition-all duration-200 dark:bg-[#232323] dark:border-gray-700 dark:hover:bg-[#232323]">
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<p className="text-sm font-medium text-gray-500 uppercase tracking-wide dark:text-gray-300">
							Selected Period
						</p>
						<h3 className="text-2xl font-semibold text-black dark:text-white">
							{dateRange.from
								? format(dateRange.from, "MMM d, yyyy")
								: "Select date"}
						</h3>
						<div className="text-sm text-gray-500 dark:text-gray-300">
							To: {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "Select date"}
						</div>
					</div>
					<div className="bg-[#facc15] p-3 rounded-lg dark:bg-[#18181b]">
						<Calendar className="w-6 h-6 text-black dark:text-[#facc15]" />
					</div>
				</div>
			</div>
		</div>
	);
}
