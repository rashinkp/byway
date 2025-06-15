"use client";

import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { LucideIcon } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  dateRange?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  showDatePicker?: boolean;
  badges?: Array<{
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    color?: string;
    icon?: LucideIcon;
  }>;
}

export default function DashboardHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBgColor,
  dateRange,
  onDateChange,
  showDatePicker = false,
  badges,
}: DashboardHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {title}
          </h1>
          <p className="text-gray-600">
            {subtitle}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {showDatePicker && dateRange && onDateChange && (
          <DatePickerWithRange
            date={dateRange}
            onDateChange={onDateChange}
          />
        )}
        
        {badges && badges.map((badge, index) => (
          <Badge
            key={index}
            variant={badge.variant}
            className={badge.color}
          >
            {badge.icon && <badge.icon className="w-3 h-3 mr-1" />}
            {badge.label}
          </Badge>
        ))}
      </div>
    </div>
  );
} 