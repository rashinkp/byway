"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { cn } from "@/utils/cn";

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
}

const eventTypeColors: Record<string, string> = {
  COURSE_CREATION: "bg-blue-100 text-blue-700",
  COURSE_APPROVED: "bg-green-100 text-green-700",
  COURSE_DECLINED: "bg-red-100 text-red-700",
  ENROLLMENT: "bg-purple-100 text-purple-700",
  PAYMENT: "bg-yellow-100 text-yellow-700",
  SYSTEM: "bg-gray-100 text-gray-700",
  ANNOUNCEMENT: "bg-pink-100 text-pink-700",
  FEEDBACK: "bg-indigo-100 text-indigo-700",
  CHAT_UPDATE: "bg-orange-100 text-orange-700",
  ASSIGNMENT: "bg-teal-100 text-teal-700",
};

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onNotificationClick, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Bell className="w-10 h-10 text-blue-400 animate-bounce mb-4" />
        <span className="text-blue-500 font-semibold animate-pulse">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl p-6 space-y-4 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Notifications</h2>
        <span className="text-xs text-gray-400">{notifications.length} total</span>
      </div>
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Bell className="w-12 h-12 mb-2" />
          <span className="text-lg font-medium">No notifications</span>
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification, idx) => (
            <React.Fragment key={notification.id}>
              <Card
                className={cn(
                  "transition-shadow cursor-pointer hover:shadow-lg border-0 bg-white/90",
                  idx === 0 ? "mt-0" : "mt-2"
                )}
                onClick={() => onNotificationClick?.(notification.id)}
              >
                <CardContent className="flex items-start gap-4 py-4 px-2">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bell className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-base line-clamp-1">{notification.title}</span>
                      {notification.eventType && (
                        <Badge className={cn("ml-2", eventTypeColors[notification.eventType] || "bg-gray-100 text-gray-700")}>{notification.eventType.replace(/_/g, " ")}</Badge>
                      )}
                      <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">{notification.date}</span>
                    </div>
                    <div className="text-gray-600 text-sm mt-1 leading-relaxed line-clamp-2">{notification.message}</div>
                  </div>
                </CardContent>
              </Card>
              {idx < notifications.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;