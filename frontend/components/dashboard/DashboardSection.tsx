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
	className = "",
}: DashboardSectionProps) {
	return (
		<div className={`space-y-6 ${className}`}>
			<div className="flex items-center gap-3">
				<div
					className={`w-10 h-10 bg-[#facc15] rounded-lg flex items-center justify-center`}
				>
					<Icon className={`w-6 h-6 text-black`} />
				</div>
				<div>
					<h2 className="text-xl font-semibold text-black">{title}</h2>
					<p className="text-gray-500">{subtitle}</p>
				</div>
			</div>
			{children}
		</div>
	);
}
