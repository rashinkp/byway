"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  setSortOrder?: (s: 'asc' | 'desc') => void;
  sortOrder?: 'asc' | 'desc';
  setEventType?: (s: string | undefined) => void;
  eventType?: string;
  loadMore?: () => void;
}

const eventTypeColors: Record<string, string> = {
  COURSE_CREATION: "bg-blue-50 text-blue-700 border-blue-200",
  COURSE_APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  COURSE_DECLINED: "bg-red-50 text-red-700 border-red-200",
  COURSE_ENABLED: "bg-green-50 text-green-700 border-green-200",
  COURSE_DISABLED: "bg-orange-50 text-orange-700 border-orange-200",
  COURSE_PURCHASED: "bg-purple-50 text-purple-700 border-purple-200",
  REVENUE_EARNED: "bg-amber-50 text-amber-700 border-amber-200",
  ENROLLMENT: "bg-purple-50 text-purple-700 border-purple-200",
  PAYMENT: "bg-amber-50 text-amber-700 border-amber-200",
  SYSTEM: "bg-slate-50 text-slate-700 border-slate-200",
  ANNOUNCEMENT: "bg-pink-50 text-pink-700 border-pink-200",
  FEEDBACK: "bg-indigo-50 text-indigo-700 border-indigo-200",
  CHAT_UPDATE: "bg-orange-50 text-orange-700 border-orange-200",
  ASSIGNMENT: "bg-teal-50 text-teal-700 border-teal-200",
  INSTRUCTOR_APPROVED: "bg-green-50 text-green-700 border-green-200",
  INSTRUCTOR_DECLINED: "bg-red-50 text-red-700 border-red-200",
  USER_DISABLED: "bg-red-50 text-red-700 border-red-200",
  USER_ENABLED: "bg-green-50 text-green-700 border-green-200",
};

const eventTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'COURSE_CREATION', label: 'Course Creation' },
  { value: 'COURSE_APPROVED', label: 'Course Approved' },
  { value: 'COURSE_DECLINED', label: 'Course Declined' },
  { value: 'COURSE_ENABLED', label: 'Course Enabled' },
  { value: 'COURSE_DISABLED', label: 'Course Disabled' },
  { value: 'COURSE_PURCHASED', label: 'Course Purchased' },
  { value: 'REVENUE_EARNED', label: 'Revenue Earned' },
  { value: 'ENROLLMENT', label: 'Enrollment' },
  { value: 'PAYMENT', label: 'Payment' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'ANNOUNCEMENT', label: 'Announcement' },
  { value: 'FEEDBACK', label: 'Feedback' },
  { value: 'CHAT_UPDATE', label: 'Chat Update' },
  { value: 'ASSIGNMENT', label: 'Assignment' },
  { value: 'INSTRUCTOR_APPROVED', label: 'Instructor Approved' },
  { value: 'INSTRUCTOR_DECLINED', label: 'Instructor Declined' },
  { value: 'USER_DISABLED', label: 'Account Disabled' },
  { value: 'USER_ENABLED', label: 'Account Enabled' },
];

const sortOptions = [
  { value: 'createdAt', label: 'Date' },
  { value: 'eventType', label: 'Type' },
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
  const uniqueNotifications = notifications.filter((notification, index, self) => 
    index === self.findIndex(n => n.id === notification.id)
  );

  return (
    <div className="w-full h-full flex flex-col bg-[var(--color-background)]">
      {/* Header */}
      <div className="p-6 ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-surface)] rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-[var(--color-primary-light)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">{total ?? uniqueNotifications.length} total</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
              value={search || ''}
              onChange={e => setSearch?.(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {/* Event Type Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-full pl-10 pr-8 py-2.5 bg-[var(--color-surface)] border-0 rounded-lg text-sm text-[var(--color-primary-dark)] flex justify-between items-center hover:text-[var(--color-primary-light)] transition-colors"
                  type="button"
                >
                  {eventTypeOptions.find(opt => opt.value === eventType)?.label || 'All Types'}
                  <ChevronDown className="ml-2 w-4 h-4 text-[var(--color-muted)]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full min-w-[180px] bg-[var(--color-surface)] text-[var(--color-primary-dark)] shadow-lg border-0 p-1">
                {eventTypeOptions.map(opt => (
                  <DropdownMenuItem
                    key={opt.value}
                    onSelect={() => setEventType?.(opt.value || undefined)}
                    className={eventType === opt.value ? "bg-[var(--color-background)] text-[var(--color-primary-dark)] rounded" : "rounded"}
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
                  className="w-full pl-10 pr-8 py-2.5 bg-[var(--color-surface)] border-0 rounded-lg text-sm text-[var(--color-primary-dark)] flex justify-between items-center hover:text-[var(--color-primary-light)] transition-colors"
                  type="button"
                >
                  {sortOptions.find(opt => opt.value === sortBy)?.label || 'Date'}
                  <ChevronDown className="ml-2 w-4 h-4 text-[var(--color-muted)]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full min-w-[140px] bg-[var(--color-surface)] text-[var(--color-primary-dark)] shadow-lg border-0 p-1">
                {sortOptions.map(opt => (
                  <DropdownMenuItem
                    key={opt.value}
                    onSelect={() => setSortBy?.(opt.value)}
                    className={sortBy === opt.value ? "bg-[var(--color-background)] text-[var(--color-primary-dark)] rounded" : "rounded"}
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
                  className="px-4 py-2.5 bg-[var(--color-surface)] border-0 rounded-lg text-sm text-[var(--color-primary-dark)] flex justify-between items-center hover:text-[var(--color-primary-light)] transition-colors"
                  type="button"
                >
                  {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
                  <ChevronDown className="ml-2 w-4 h-4 text-[var(--color-muted)]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full min-w-[100px] bg-[var(--color-surface)] text-[var(--color-primary-dark)] shadow-lg border-0 p-1">
                <DropdownMenuItem
                  onSelect={() => setSortOrder?.('desc')}
                  className={sortOrder === 'desc' ? "bg-[var(--color-background)] text-[var(--color-primary-dark)] rounded" : "rounded"}
                >
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setSortOrder?.('asc')}
                  className={sortOrder === 'asc' ? "bg-[var(--color-background)] text-[var(--color-primary-dark)] rounded" : "rounded"}
                >
                  Oldest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {loading && (!notifications || notifications.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-16 h-16 bg-[var(--color-surface)] rounded-2xl flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-[var(--color-primary-light)] animate-pulse" />
            </div>
            <h3 className="text-lg font-medium text-[var(--color-primary-dark)] mb-2">Loading notifications</h3>
            <p className="text-gray-500 text-sm">Please wait while we fetch your updates...</p>
          </div>
        ) : uniqueNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500 text-sm">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="p-4 space-y-2">
              {uniqueNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className="group border-0 bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer rounded-xl overflow-hidden"
                  onClick={() => onNotificationClick?.(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                          <Bell className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
                            {notification.date}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
                          {notification.message}
                        </p>
                        
                        {notification.eventType && (
                          <Badge 
                            variant="outline"
                            className={`text-xs font-medium border ${eventTypeColors[notification.eventType] || "bg-gray-50 text-gray-700 border-gray-200"}`}
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
            
            {hasMore && !loading && uniqueNotifications.length < (total || 0) && (
              <div className="flex justify-center py-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setLoadMoreLoading(true);
                    console.log('Load More Clicked:', {
                      page,
                      hasMore,
                      loading,
                      notificationsLength: uniqueNotifications.length,
                    });
                    loadMore?.();
                    setTimeout(() => setLoadMoreLoading(false), 1000); // Simulate loading state
                  }}
                  disabled={loading || loadMoreLoading}
                  className="min-w-[120px]"
                >
                  {loadMoreLoading || loading ? 'Loading...' : 'Load More'}
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