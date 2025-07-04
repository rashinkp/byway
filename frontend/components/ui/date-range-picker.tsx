"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/utils/cn";

interface DatePickerWithRangeProps {
	date: DateRange | undefined;
	onDateChange: (date: DateRange | undefined) => void;
	className?: string;
}

export function DatePickerWithRange({
	date,
	onDateChange,
	className,
}: DatePickerWithRangeProps) {
	const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const from = e.target.value ? new Date(e.target.value) : undefined;
		onDateChange({ from, to: date?.to });
	};

	const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const to = e.target.value ? new Date(e.target.value) : undefined;
		onDateChange({ from: date?.from, to });
	};

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div className="flex items-center gap-2">
				<CalendarIcon className="h-4 w-4 text-gray-500" />
				<input
					type="date"
					value={date?.from ? format(date.from, "yyyy-MM-dd") : ""}
					onChange={handleFromChange}
					className="px-2 py-1 border rounded-md text-sm"
				/>
			</div>
			<span className="text-gray-500">to</span>
			<div className="flex items-center gap-2">
				<CalendarIcon className="h-4 w-4 text-gray-500" />
				<input
					type="date"
					value={date?.to ? format(date.to, "yyyy-MM-dd") : ""}
					onChange={handleToChange}
					className="px-2 py-1 border rounded-md text-sm"
				/>
			</div>
		</div>
	);
}
