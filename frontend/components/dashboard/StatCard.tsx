import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  value: string | number;
  badges?: Array<{
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    color?: string;
    icon?: LucideIcon;
  }>;
  className?: string;
}

export function StatCard({ 
  icon: Icon, 
  iconColor, 
  title, 
  value, 
  badges, 
  className = "" 
}: StatCardProps) {
  return (
    <div className={`bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {badges && (
            <div className="flex items-center gap-2">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                    badge.variant === "default" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    badge.variant === "secondary" ? "bg-gray-50 text-gray-700 border-gray-200" :
                    badge.variant === "destructive" ? "bg-red-50 text-red-700 border-red-200" :
                    "bg-green-50 text-green-700 border-green-200"
                  } ${badge.color || ""}`}
                >
                  {badge.icon && <badge.icon className="w-3 h-3" />}
                  {badge.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 