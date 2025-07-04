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
				<div className="bg-blue-50 p-2 rounded-lg">
					<BarChart3 className="w-6 h-6 text-blue-600" />
				</div>
				<div>
					<h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
					<p className="text-gray-600">{subtitle}</p>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<DatePickerWithRange date={dateRange} onDateChange={onDateChange} />
				<Badge
					variant="outline"
					className="bg-green-50 text-green-700 border-green-200"
				>
					<Activity className="w-3 h-3 mr-1" />
					Live Data
				</Badge>
			</div>
		</div>
	);
}
