import { useEffect, useState, useCallback, useRef } from "react";
import { getUserNotificationsSocket } from "@/services/socketNotification";
import { useAuth } from "@/hooks/auth/useAuth";
import socket from "@/lib/socket";
import { Notification } from "@/types/notification";

// Utility function to deduplicate notifications by ID
const deduplicateNotifications = (notifications: Notification[]) => {
	const seenIds = new Set();
	return notifications.filter((n) => {
		if (seenIds.has(n.id)) {
			return false;
		}
		seenIds.add(n.id);
		return true;
	});
};

function formatTime(dateStr: string) {
	const date = new Date(dateStr);
	return date.toLocaleString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}

function formatDateForGrouping(dateStr: string) {
	const date = new Date(dateStr);
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (date.toDateString() === today.toDateString()) {
		return "Today";
	} else if (date.toDateString() === yesterday.toDateString()) {
		return "Yesterday";
	} else {
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}
}

export const useNotificationSocket = () => {
	const { user } = useAuth();
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [total, setTotal] = useState(0);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [eventType, setEventType] = useState<string | undefined>(undefined);
	const take = 5;
	const prevFilters = useRef({ search, sortBy, sortOrder, eventType });

	const fetchNotifications = useCallback(
		(opts?: { reset?: boolean; pageOverride?: number }) => {
			if (!user?.id) return;
			setLoading(true);
			setError(null);
			const currentPage = opts?.pageOverride ?? page;
			const skip = opts?.reset ? 0 : (currentPage - 1) * take;

			getUserNotificationsSocket(
				{
					userId: user.id,
					skip,
					take,
					sortBy,
					sortOrder,
					eventType,
					search: search.trim() || undefined,
				},
				(result) => {
					setTotal(result.total);
					setHasMore(result.hasMore);
					const mapped = (result.items || []).map((n: Notification) => ({
						...n,
						title: n.entityName || n.eventType || "Notification",
						message: n.message,
						time: formatTime(n.createdAt),
						date: formatDateForGrouping(n.createdAt),
						eventType: n.eventType,
					}));
					if (opts?.reset) {
						// Deduplicate notifications when resetting
						setNotifications(deduplicateNotifications(mapped));
					} else {
						setNotifications((prev) => {
							// Create a Set of existing notification IDs for efficient lookup
							const existingIds = new Set(prev.map((n) => n.id));
							// Filter out duplicates from new notifications
							const uniqueNewNotifications = mapped.filter(
								(n) => !existingIds.has(n.id),
							);
							const combined = [...prev, ...uniqueNewNotifications];

							// Deduplicate the entire array by ID
							return deduplicateNotifications(combined);
						});
					}
					setLoading(false);
				},
			);
		},
		[user?.id, sortBy, sortOrder, eventType, search, page],
	);

	// Effect: Reset page and fetch when filters/search/sort change
	useEffect(() => {
		if (!user?.id) return;
		// Only run if filters/search/sort actually changed
		const prev = prevFilters.current;
		if (
			prev.search !== search ||
			prev.sortBy !== sortBy ||
			prev.sortOrder !== sortOrder ||
			prev.eventType !== eventType
		) {
			setPage(1);
			fetchNotifications({ reset: true, pageOverride: 1 });
			prevFilters.current = { search, sortBy, sortOrder, eventType };
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, sortBy, sortOrder, eventType, user?.id]);

	// Effect: Fetch next page when page changes (but not on first render)
	useEffect(() => {
		if (!user?.id) return;
		if (page > 1) {
			fetchNotifications({ pageOverride: page });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, user?.id]);

	// Effect: Initial fetch on mount or user change
	useEffect(() => {
		if (user?.id) {
			setPage(1);
			fetchNotifications({ reset: true, pageOverride: 1 });
			prevFilters.current = { search, sortBy, sortOrder, eventType };
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.id]);

	// Listen for real-time notification events
	useEffect(() => {
		if (!user?.id) return;
		const handleNewNotification = () => {
			setPage(1);
			fetchNotifications({ reset: true, pageOverride: 1 });
		};
		socket.on("newNotification", handleNewNotification);
		return () => {
			socket.off("newNotification", handleNewNotification);
		};
	}, [user?.id, fetchNotifications]);

	const loadMore = () => {
		if (hasMore && !loading) {
			setPage((prev) => prev + 1);
		}
	};

	const refetch = () => {
		setPage(1);
		fetchNotifications({ reset: true, pageOverride: 1 });
	};

	return {
		notifications,
		loading,
		error,
		hasMore,
		total,
		page,
		setPage,
		search,
		setSearch,
		sortBy,
		setSortBy,
		sortOrder,
		setSortOrder,
		eventType,
		setEventType,
		loadMore,
		refetch,
	};
};
