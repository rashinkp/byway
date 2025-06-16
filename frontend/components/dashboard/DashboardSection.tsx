import { LucideIcon } from "lucide-react";

interface DashboardSectionProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({ 
  icon: Icon, 
  iconColor, 
  iconBgColor, 
  title, 
  subtitle, 
  children, 
  className = "" 
}: DashboardSectionProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
} 