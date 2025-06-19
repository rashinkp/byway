"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search, Filter, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  // Deduplicate notifications by ID as a safeguard
  const uniqueNotifications = notifications.filter((notification, index, self) => 
    index === self.findIndex(n => n.id === notification.id)
  );

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
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
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none appearance-none cursor-pointer"
                value={eventType || ''}
                onChange={e => setEventType?.(e.target.value || undefined)}
              >
                {eventTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none appearance-none cursor-pointer"
                value={sortBy || 'createdAt'}
                onChange={e => setSortBy?.(e.target.value)}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            <select
              className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none appearance-none cursor-pointer"
              value={sortOrder || 'desc'}
              onChange={e => setSortOrder?.(e.target.value as 'asc' | 'desc')}
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {loading && (!notifications || notifications.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-blue-500 animate-pulse" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading notifications</h3>
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
              <div className="p-4 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={loadMore}
                  className="px-8 py-2 bg-white hover:bg-gray-50 border-gray-200 rounded-xl font-medium transition-all duration-200"
                >
                  Load more notifications
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