"use client";

import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  badges?: Array<{
    label: string;
    value: number | string;
    variant: "default" | "secondary" | "destructive" | "outline";
    color?: string;
    icon?: LucideIcon;
  }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  badges,
  trend,
}: StatsCardProps) {
  return (
    <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:bg-white/80 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-2xl font-semibold text-gray-900">
            {value}
          </h3>
          
          {trend && (
            <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-1">{trend.isPositive ? '↗' : '↘'}</span>
              <span>{trend.value}</span>
            </div>
          )}

          {badges && badges.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              {badges.map((badge, index) => (
                <Badge 
                  key={index}
                  variant={badge.variant}
                  className={badge.color}
                >
                  {badge.icon && <badge.icon className="w-3 h-3 mr-1" />}
                  {badge.label}: {badge.value}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
} 