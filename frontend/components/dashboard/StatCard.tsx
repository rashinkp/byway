import { LucideIcon } from "lucide-react";

interface StatCardProps {
	icon: LucideIcon;
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
	title,
	value,
	badges,
	className = "",
}: StatCardProps) {
	return (
		<div
			className={`bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 dark:bg-[#232323] dark:border-gray-700 ${className}`}
		>
			<div className="flex items-center justify-between">
				<div className="space-y-2 flex-1">
					<div className="flex items-center gap-2">
						<Icon className={`w-5 h-5 text-[#facc15] dark:text-[#facc15]`} />
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
					</div>
					<div className="text-2xl font-bold text-black dark:text-white">{value}</div>
					{badges && (
						<div className="flex items-center gap-2">
							{badges.map((badge, index) => (
								<span
									key={index}
									className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
										badge.variant === "default"
											? "bg-[#facc15] text-black border-[#facc15] dark:bg-[#18181b] dark:text-[#facc15] dark:border-[#facc15]"
										: badge.variant === "secondary"
											? "bg-gray-100 text-gray-700 border-gray-200 dark:bg-[#232323] dark:text-gray-300 dark:border-gray-700"
											: badge.variant === "destructive"
												? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
												: "border-yellow-400 text-yellow-700 bg-white dark:bg-[#232323] dark:text-[#facc15] dark:border-[#facc15]"
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
