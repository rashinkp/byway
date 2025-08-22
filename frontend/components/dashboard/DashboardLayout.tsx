import { Activity, BarChart3 } from "lucide-react";

interface DashboardLayoutProps {
	title: string;
	subtitle: string;
	isLoading: boolean;
	error: Error | null;
	data?: Record<string, unknown> | null;
	children: React.ReactNode;
}

export function DashboardLayout({
	title,
	subtitle,
	isLoading,
	error,
	data,
	children,
}: DashboardLayoutProps) {
	if (isLoading) {
		return (
			<div className="min-h-screen p-4 sm:p-6">
				<div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
					<div className="animate-pulse">
						<div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 mb-3 sm:mb-4"></div>
						<div className="h-3 sm:h-4 bg-gray-200 rounded w-72 sm:w-96 mb-6 sm:mb-8"></div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="bg-white rounded-xl p-4 sm:p-6 h-24 sm:h-32 animate-pulse"
								>
									<div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24 mb-2"></div>
									<div className="h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16 mb-3 sm:mb-4"></div>
									<div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50/50 p-4 sm:p-6">
				<div className="max-w-7xl mx-auto">
					<div className="bg-red-50 border border-red-200 rounded-lg p-4">
						<h2 className="text-red-800 font-semibold text-lg sm:text-xl">
							Error Loading Dashboard
						</h2>
						<p className="text-red-600 text-sm sm:text-base">{error.message}</p>
					</div>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="min-h-screen bg-gray-50/50 p-4 sm:p-6">
				<div className="max-w-7xl mx-auto">
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<h2 className="text-yellow-800 font-semibold text-lg sm:text-xl">No Data Available</h2>
						<p className="text-yellow-600 text-sm sm:text-base">
							Dashboard data is not available at the moment.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 dark:bg-[#18181b]">
			<div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
				{/* Header Section */}
				<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-[#facc15] rounded-lg flex items-center justify-center dark:bg-[#232323] flex-shrink-0">
							<BarChart3 className="w-6 h-6 text-black dark:text-[#facc15]" />
						</div>
						<div className="min-w-0 flex-1">
							<h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white truncate">{title}</h1>
							<p className="text-sm sm:text-base text-gray-500 dark:text-gray-300 truncate">{subtitle}</p>
						</div>
					</div>
					<div className="sm:ml-auto flex-shrink-0">
						<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-[#facc15] text-black border border-[#facc15] dark:bg-[#232323] dark:text-[#facc15] dark:border-[#facc15]">
							<Activity className="w-4 h-4" />
							Live Data
						</span>
					</div>
				</div>

				{children}
			</div>
		</div>
	);
}
