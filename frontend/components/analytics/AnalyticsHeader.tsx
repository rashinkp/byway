"use client";

import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { BarChart3, Activity } from "lucide-react";

interface AnalyticsHeaderProps {
	title: string;
	subtitle: string;
	dateRange: DateRange;
	onDateChange: (date: DateRange | undefined) => void;
}

export default function AnalyticsHeader({
	title,
	subtitle,
	dateRange,
	onDateChange,
}: AnalyticsHeaderProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<div className="bg-[#facc15] p-2 rounded-lg dark:bg-[#232323]">
					<BarChart3 className="w-6 h-6 text-black dark:text-[#facc15]" />
				</div>
				<div>
					<h1 className="text-2xl font-semibold text-black dark:text-white">{title}</h1>
					<p className="text-gray-500 dark:text-gray-300">{subtitle}</p>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<DatePickerWithRange date={dateRange} onDateChange={onDateChange} />
				<Badge
					className="bg-white text-black border-[#facc15] dark:bg-[#232323] dark:text-[#facc15] dark:border-[#facc15]"
				>
					<Activity className="w-3 h-3 mr-1 text-[#facc15] dark:text-[#facc15]" />
					Live Data
				</Badge>
			</div>
		</div>
	);
}
