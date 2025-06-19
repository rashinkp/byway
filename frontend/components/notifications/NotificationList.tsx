"use client";
import React from "react";

export type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
};

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick?: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onNotificationClick }) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl p-6 space-y-4 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Notifications</h2>
        <span className="text-xs text-gray-400">{notifications.length} total</span>
      </div>
      {notifications.length === 0 ? (
        <div className="text-gray-400 text-center py-12 text-lg">No notifications</div>
      ) : (
        <ul className="divide-y divide-blue-100">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="py-4 px-3 cursor-pointer hover:bg-blue-100/60 rounded-xl transition-all duration-200"
              onClick={() => onNotificationClick?.(notification.id)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-800 text-lg">{notification.title}</span>
                <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{notification.date}</span>
              </div>
              <div className="text-gray-600 text-base mt-1 leading-relaxed">{notification.message}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;