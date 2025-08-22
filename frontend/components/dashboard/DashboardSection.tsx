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
	title,
	subtitle,
	children,
	className = "",
}: DashboardSectionProps) {
	return (
		<div className={`space-y-4 sm:space-y-6 ${className}`}>
			<div className="flex items-center gap-3">
				<div
					className={`w-8 h-8 sm:w-10 sm:h-10 bg-[#facc15] rounded-lg flex items-center justify-center flex-shrink-0`}
				>
					<Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-black`} />
				</div>
				<div className="min-w-0 flex-1">
					<h2 className="text-lg sm:text-xl font-semibold text-black dark:text-white truncate">{title}</h2>
					<p className="text-sm sm:text-base text-gray-500 dark:text-gray-300 truncate">{subtitle}</p>
				</div>
			</div>
			{children}
		</div>
	);
}
