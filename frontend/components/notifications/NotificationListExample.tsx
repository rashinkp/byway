"use client";
import React from "react";
import NotificationList, { Notification } from "./NotificationList";

// Example usage of the updated NotificationList component
const NotificationListExample: React.FC = () => {
  // Sample notifications with different dates and times
  const sampleNotifications: Notification[] = [
    {
      id: "1",
      title: "Course Approved",
      message: "Your course 'Advanced React Development' has been approved and is now live on the platform.",
      time: "14:30",
      date: new Date().toISOString().split('T')[0], // Today
      eventType: "COURSE_APPROVED"
    },
    {
      id: "2",
      title: "New Enrollment",
      message: "John Doe has enrolled in your course 'JavaScript Fundamentals'.",
      time: "09:15",
      date: new Date().toISOString().split('T')[0], // Today
      eventType: "ENROLLMENT"
    },
    {
      id: "3",
      title: "Payment Received",
      message: "Payment of $49.99 received for course 'Python for Beginners'.",
      time: "16:45",
      date: new Date().toISOString().split('T')[0], // Today
      eventType: "PAYMENT"
    },
    {
      id: "4",
      title: "Course Declined",
      message: "Your course 'Web Development Basics' has been declined. Please review the feedback and resubmit.",
      time: "11:20",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
      eventType: "COURSE_DECLINED"
    },
    {
      id: "5",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST.",
      time: "08:00",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
      eventType: "SYSTEM"
    },
    {
      id: "6",
      title: "New Message",
      message: "You have a new message from student Sarah Wilson regarding the course content.",
      time: "13:30",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
      eventType: "CHAT_UPDATE"
    },
    {
      id: "7",
      title: "Course Creation",
      message: "Your new course 'Data Science Fundamentals' has been created successfully.",
      time: "10:45",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
      eventType: "COURSE_CREATION"
    },
    {
      id: "8",
      title: "Feedback Received",
      message: "You received 5-star feedback for your course 'React Hooks Mastery'.",
      time: "15:20",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week ago
      eventType: "FEEDBACK"
    }
  ];

  const [notifications, setNotifications] = React.useState<Notification[]>(sampleNotifications);
  const [search, setSearch] = React.useState("");
  const [eventType, setEventType] = React.useState<string | undefined>();
  const [sortBy, setSortBy] = React.useState("createdAt");
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  const handleNotificationClick = (id: string) => {
    console.log("Notification clicked:", id);
    // Handle notification click - mark as read, navigate, etc.
  };

  const handleLoadMore = () => {
    console.log("Loading more notifications...");
    // Implement pagination logic here
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notification List Example</h1>
      <p className="text-gray-600 mb-6">
        This example demonstrates the WhatsApp-like notification grouping with:
        <br />
        • Date headers (Today, Yesterday, Day names, Full dates)
        <br />
        • Time formatting in hh:mm AM/PM format
        <br />
        • Notifications sorted by date and time within each group
      </p>
      
      <div className="h-[600px] border rounded-lg overflow-hidden">
        <NotificationList
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          search={search}
          setSearch={setSearch}
          eventType={eventType}
          setEventType={setEventType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          loadMore={handleLoadMore}
          hasMore={false}
          total={notifications.length}
        />
      </div>
    </div>
  );
};

export default NotificationListExample; 