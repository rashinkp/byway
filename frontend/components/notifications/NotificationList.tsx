"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Filter, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export type Notification = {
	id: string;
	title: string;
	message: string;
	date: string;
	eventType?: string;
};

interface NotificationListProps {
	notifications: Notification[];
	onNotificationClick?: (id: string) => void;
	loading?: boolean;
	hasMore?: boolean;
	total?: number;
	page?: number;
	setSearch?: (s: string) => void;
	search?: string;
	setSortBy?: (s: string) => void;
	sortBy?: string;
	setSortOrder?: (s: "asc" | "desc") => void;
	sortOrder?: "asc" | "desc";
	setEventType?: (s: string | undefined) => void;
	eventType?: string;
	loadMore?: () => void;
}

const eventTypeColors: Record<string, string> = {
	COURSE_CREATION: "bg-blue-50 text-blue-600 border-blue-200",
	COURSE_APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-200",
	COURSE_DECLINED: "bg-red-50 text-red-600 border-red-200",
	COURSE_ENABLED: "bg-green-50 text-green-600 border-green-200",
	COURSE_DISABLED: "bg-orange-50 text-orange-600 border-orange-200",
	COURSE_PURCHASED: "bg-purple-50 text-purple-600 border-purple-200",
	REVENUE_EARNED: "bg-amber-50 text-amber-600 border-amber-200",
	ENROLLMENT: "bg-purple-50 text-purple-600 border-purple-200",
	PAYMENT: "bg-amber-50 text-amber-600 border-amber-200",
	SYSTEM: "bg-slate-50 text-slate-600 border-slate-200",
	ANNOUNCEMENT: "bg-pink-50 text-pink-600 border-pink-200",
	FEEDBACK: "bg-indigo-50 text-indigo-600 border-indigo-200",
	CHAT_UPDATE: "bg-orange-50 text-orange-600 border-orange-200",
	ASSIGNMENT: "bg-teal-50 text-teal-600 border-teal-200",
	INSTRUCTOR_APPROVED: "bg-green-50 text-green-600 border-green-200",
	INSTRUCTOR_DECLINED: "bg-red-50 text-red-600 border-red-200",
	USER_DISABLED: "bg-red-50 text-red-600 border-red-200",
	USER_ENABLED: "bg-green-50 text-green-600 border-green-200",
};

const eventTypeOptions = [
	{ value: "", label: "All Types" },
	{ value: "COURSE_CREATION", label: "Course Creation" },
	{ value: "COURSE_APPROVED", label: "Course Approved" },
	{ value: "COURSE_DECLINED", label: "Course Declined" },
	{ value: "COURSE_ENABLED", label: "Course Enabled" },
	{ value: "COURSE_DISABLED", label: "Course Disabled" },
	{ value: "COURSE_PURCHASED", label: "Course Purchased" },
	{ value: "REVENUE_EARNED", label: "Revenue Earned" },
	{ value: "ENROLLMENT", label: "Enrollment" },
	{ value: "PAYMENT", label: "Payment" },
	{ value: "SYSTEM", label: "System" },
	{ value: "ANNOUNCEMENT", label: "Announcement" },
	{ value: "FEEDBACK", label: "Feedback" },
	{ value: "CHAT_UPDATE", label: "Chat Update" },
	{ value: "ASSIGNMENT", label: "Assignment" },
	{ value: "INSTRUCTOR_APPROVED", label: "Instructor Approved" },
	{ value: "INSTRUCTOR_DECLINED", label: "Instructor Declined" },
	{ value: "USER_DISABLED", label: "Account Disabled" },
	{ value: "USER_ENABLED", label: "Account Enabled" },
];

const sortOptions = [
	{ value: "createdAt", label: "Date" },
	{ value: "eventType", label: "Type" },
];

const NotificationList: React.FC<NotificationListProps> = ({
	notifications,
	onNotificationClick,
	loading,
	hasMore,
	total,
	page,
	setSearch,
	search,
	setSortBy,
	sortBy,
	setSortOrder,
	sortOrder,
	setEventType,
	eventType,
	loadMore,
}) => {
	const [loadMoreLoading, setLoadMoreLoading] = React.useState(false);

	// Deduplicate notifications by ID as a safeguard
	const uniqueNotifications = notifications.filter(
		(notification, index, self) =>
			index === self.findIndex((n) => n.id === notification.id),
	);

	return (
		<div className="w-full h-full flex flex-col bg-[var(--color-background)]">
			{/* Header */}
			<div className="p-6 bg-[var(--color-surface)] border-b border-[var(--color-background)]">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center shadow-sm">
							<Bell className="w-6 h-6 text-white" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-[var(--color-primary-dark)]">
								Notifications
							</h2>
							<p className="text-sm text-[var(--color-muted)]">
								{total ?? uniqueNotifications.length} total notifications
							</p>
						</div>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="space-y-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
						<input
							type="text"
							placeholder="Search notifications..."
							className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-gray-200 rounded-xl text-sm text-[var(--color-primary-dark)] placeholder-[var(--color-muted)] focus:ring-2 focus:ring-[var(--color-primary-light)]/20 focus:border-[var(--color-primary-light)] focus:outline-none transition-all duration-200"
							value={search || ""}
							onChange={(e) => setSearch?.(e.target.value)}
						/>
					</div>

					<div className="flex gap-3">
						{/* Event Type Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									className="flex-1 px-4 py-3 bg-[var(--color-background)] border border-gray-200 rounded-xl text-sm text-[var(--color-primary-dark)] flex justify-between items-center hover:border-[var(--color-primary-light)] hover:bg-[var(--color-surface)] transition-all duration-200"
									type="button"
								>
									<span className="flex items-center gap-2">
										<Filter className="w-4 h-4" />
										{eventTypeOptions.find((opt) => opt.value === eventType)
											?.label || "All Types"}
									</span>
									<ChevronDown className="w-4 h-4 text-[var(--color-muted)]" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								className="w-full min-w-[200px] bg-[var(--color-surface)] border border-gray-200 shadow-lg rounded-xl p-1"
							>
								{eventTypeOptions.map((opt) => (
									<DropdownMenuItem
										key={opt.value}
										onSelect={() => setEventType?.(opt.value || undefined)}
										className={`rounded-lg px-3 py-2 text-sm transition-colors ${
											eventType === opt.value
												? "bg-[var(--color-primary-light)] text-white"
												: "text-[var(--color-primary-dark)] hover:bg-[var(--color-background)]"
										}`}
									>
										{opt.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Sort By Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									className="px-4 py-3 bg-[var(--color-background)] border border-gray-200 rounded-xl text-sm text-[var(--color-primary-dark)] flex justify-between items-center hover:border-[var(--color-primary-light)] hover:bg-[var(--color-surface)] transition-all duration-200"
									type="button"
								>
									<span className="flex items-center gap-2">
										<Clock className="w-4 h-4" />
										{sortOptions.find((opt) => opt.value === sortBy)?.label ||
											"Date"}
									</span>
									<ChevronDown className="w-4 h-4 text-[var(--color-muted)]" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								className="w-full min-w-[140px] bg-[var(--color-surface)] border border-gray-200 shadow-lg rounded-xl p-1"
							>
								{sortOptions.map((opt) => (
									<DropdownMenuItem
										key={opt.value}
										onSelect={() => setSortBy?.(opt.value)}
										className={`rounded-lg px-3 py-2 text-sm transition-colors ${
											sortBy === opt.value
												? "bg-[var(--color-primary-light)] text-white"
												: "text-[var(--color-primary-dark)] hover:bg-[var(--color-background)]"
										}`}
									>
										{opt.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Sort Order Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									className="px-4 py-3 bg-[var(--color-background)] border border-gray-200 rounded-xl text-sm text-[var(--color-primary-dark)] flex justify-between items-center hover:border-[var(--color-primary-light)] hover:bg-[var(--color-surface)] transition-all duration-200"
									type="button"
								>
									{sortOrder === "asc" ? "Oldest" : "Newest"}
									<ChevronDown className="ml-2 w-4 h-4 text-[var(--color-muted)]" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								className="w-full min-w-[100px] bg-[var(--color-surface)] border border-gray-200 shadow-lg rounded-xl p-1"
							>
								<DropdownMenuItem
									onSelect={() => setSortOrder?.("desc")}
									className={`rounded-lg px-3 py-2 text-sm transition-colors ${
										sortOrder === "desc"
											? "bg-[var(--color-primary-light)] text-white"
											: "text-[var(--color-primary-dark)] hover:bg-[var(--color-background)]"
									}`}
								>
									Newest
								</DropdownMenuItem>
								<DropdownMenuItem
									onSelect={() => setSortOrder?.("asc")}
									className={`rounded-lg px-3 py-2 text-sm transition-colors ${
										sortOrder === "asc"
											? "bg-[var(--color-primary-light)] text-white"
											: "text-[var(--color-primary-dark)] hover:bg-[var(--color-background)]"
									}`}
								>
									Oldest
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 min-h-0 bg-[var(--color-background)]">
				{loading && (!notifications || notifications.length === 0) ? (
					<div className="flex flex-col items-center justify-center h-full py-12">
						<div className="w-16 h-16 bg-[var(--color-surface)] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
							<Bell className="w-8 h-8 text-[var(--color-primary-light)] animate-pulse" />
						</div>
						<h3 className="text-lg font-semibold text-[var(--color-primary-dark)] mb-2">
							Loading notifications
						</h3>
						<p className="text-[var(--color-muted)] text-sm">
							Please wait while we fetch your updates...
						</p>
					</div>
				) : uniqueNotifications.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full py-12">
						<div className="w-16 h-16 bg-[var(--color-surface)] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
							<Bell className="w-8 h-8 text-[var(--color-muted)]" />
						</div>
						<h3 className="text-lg font-semibold text-[var(--color-primary-dark)] mb-2">
							No notifications
						</h3>
						<p className="text-[var(--color-muted)] text-sm">
							You&#39;re all caught up! Check back later for updates.
						</p>
					</div>
				) : (
					<div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
						<div className="p-4 space-y-3">
							{uniqueNotifications.map((notification) => (
								<Card
									key={notification.id}
									className="group border border-gray-200 bg-[var(--color-surface)] hover:border-[var(--color-primary-light)] hover:shadow-md transition-all duration-300 cursor-pointer rounded-xl overflow-hidden"
									onClick={() => onNotificationClick?.(notification.id)}
								>
									<CardContent className="p-5">
										<div className="flex gap-4">
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between gap-3 mb-3">
													<h4 className="font-semibold text-[var(--color-primary-dark)] text-base group-hover:text-[var(--color-primary-light)] transition-colors duration-200 line-clamp-1">
														{notification.title}
													</h4>
													<span className="text-xs text-[var(--color-muted)] whitespace-nowrap font-medium bg-[var(--color-background)] px-2 py-1 rounded-md">
														{notification.date}
													</span>
												</div>

												<p className="text-[var(--color-muted)] text-sm leading-relaxed line-clamp-2 mb-3">
													{notification.message}
												</p>

												{notification.eventType && (
													<Badge
														variant="outline"
														className={`text-xs font-medium border ${
															eventTypeColors[notification.eventType] ||
															"bg-[var(--color-background)] text-[var(--color-muted)] border-gray-200"
														}`}
													>
														{notification.eventType.replace(/_/g, " ")}
													</Badge>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						{hasMore &&
							!loading &&
							uniqueNotifications.length < (total || 0) && (
								<div className="flex justify-center py-6 bg-[var(--color-background)]">
									<Button
										onClick={() => {
											setLoadMoreLoading(true);
											console.log("Load More Clicked:", {
												page,
												hasMore,
												loading,
												notificationsLength: uniqueNotifications.length,
											});
											loadMore?.();
											setTimeout(() => setLoadMoreLoading(false), 1000);
										}}
										disabled={loading || loadMoreLoading}
										className="min-w-[120px] bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-dark)] text-white border-0 rounded-xl px-6 py-3 font-medium transition-colors duration-200"
									>
										{loadMoreLoading || loading ? "Loading..." : "Load More"}
									</Button>
								</div>
							)}
					</div>
				)}
			</div>
		</div>
	);
};

export default NotificationList;
