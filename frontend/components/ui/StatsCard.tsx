"use client";

import { motion } from "framer-motion";
import {
	List,
	CheckCircle,
	XCircle,
	BookOpen,
	Users,
	Clock,
	AlertCircle,
	DollarSign,
	Activity,
	Calendar,
} from "lucide-react";
import { Stat } from "@/types/common";

interface StatsCardsProps {
	stats: Stat[];
}

export function StatsCards({ stats }: StatsCardsProps) {
	// Map stat titles to icons if not provided
	const getIcon = (title: string, icon?: string) => {
		if (icon) {
			switch (icon) {
				case "list":
					return <List className="h-4 w-4" />;
				case "check":
					return <CheckCircle className="h-4 w-4" />;
				case "x":
					return <XCircle className="h-4 w-4" />;
				case "book":
					return <BookOpen className="h-4 w-4" />;
				case "users":
					return <Users className="h-4 w-4" />;
				case "clock":
					return <Clock className="h-4 w-4" />;
				case "alert":
					return <AlertCircle className="h-4 w-4" />;
				case "dollar":
					return <DollarSign className="h-4 w-4" />;
				case "activity":
					return <Activity className="h-4 w-4" />;
				case "calendar":
					return <Calendar className="h-4 w-4" />;
				default:
					return null;
			}
		}
		const lowerTitle = title.toLowerCase();
		if (lowerTitle.includes("total")) return <List className="h-4 w-4" />;
		if (lowerTitle.includes("active"))
			return <CheckCircle className="h-4 w-4" />;
		if (lowerTitle.includes("inactive")) return <XCircle className="h-4 w-4" />;
		if (lowerTitle.includes("pending")) return <Clock className="h-4 w-4" />;
		if (lowerTitle.includes("declined"))
			return <AlertCircle className="h-4 w-4" />;
		if (lowerTitle.includes("revenue"))
			return <DollarSign className="h-4 w-4" />;
		if (lowerTitle.includes("courses")) return <BookOpen className="h-4 w-4" />;
		if (lowerTitle.includes("users")) return <Users className="h-4 w-4" />;
		return <Activity className="h-4 w-4" />;
	};



	// Animation variants for fade-in
	const cardVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: (index: number) => ({
			opacity: 1,
			y: 0,
			transition: { delay: index * 0.03, duration: 0.2 },
		}),
	};

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
			{stats.map((stat, index) => (
				<motion.div
					key={index}
					variants={cardVariants}
					initial="hidden"
					animate="visible"
					custom={index}
				>
					<div
						className={`bg-white/80 dark:bg-[#232323] backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-lg p-4 hover:bg-white/80 dark:hover:bg-[#232323] transition-all duration-200 hover:shadow-sm`}
					>
						<div className="flex items-center justify-between mb-2">
							<div className="text-[#facc15] dark:text-[#facc15] opacity-75">
								{getIcon(stat.title, stat.icon)}
							</div>
						</div>
						<div className="space-y-1">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								{stat.value}
							</h3>
							<p className="text-xs font-medium text-gray-700 dark:text-[#facc15] uppercase tracking-wide">
								{stat.title}
							</p>
							{stat.description && (
								<p className="text-xs text-gray-500 dark:text-gray-300">{stat.description}</p>
							)}
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
}
