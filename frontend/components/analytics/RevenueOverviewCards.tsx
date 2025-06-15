"use client";

import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Activity,
} from "lucide-react";

interface RevenueOverviewCardsProps {
  overallData: {
    data: {
      totalRevenue: number;
      refundedAmount: number;
      netRevenue: number;
    };
  } | null;
  dateRange: DateRange;
}

export default function RevenueOverviewCards({ 
  overallData, 
  dateRange 
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
      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white/80 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Total Revenue
            </p>
            <h3 className="text-2xl font-semibold text-gray-900">
              {formatCurrency(overallData?.data?.totalRevenue || 0)}
            </h3>
            <div className="flex items-center text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="text-sm">
                Net: {formatCurrency(overallData?.data?.netRevenue || 0)}
              </span>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white/80 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Refunded Amount
            </p>
            <h3 className="text-2xl font-semibold text-gray-900">
              {formatCurrency(overallData?.data?.refundedAmount || 0)}
            </h3>
            <div className="text-sm text-gray-500">
              Net after refunds:{" "}
              {formatCurrency(overallData?.data?.netRevenue || 0)}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <ArrowDownRight className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white/80 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Selected Period
            </p>
            <h3 className="text-2xl font-semibold text-gray-900">
              {dateRange.from
                ? format(dateRange.from, "MMM d, yyyy")
                : "Select date"}
            </h3>
            <div className="text-sm text-gray-500">
              To:{" "}
              {dateRange.to
                ? format(dateRange.to, "MMM d, yyyy")
                : "Select date"}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
} 