"use client";

import { StatsCards } from "@/components/ui/StatsCard";
import { useAuthStore } from "@/stores/auth.store";
import { useGetAllUsers } from "@/hooks/user/useGetAllUsers";
import { useEffect, useState } from "react";

export default function InstructorDashboard() {
  // const { user } = useAuthStore();
  const [stats, setStats] = useState([
    { title: "Total Courses", value: 0 },
    { title: "Active Students", value: 0 },
    { title: "Pending Requests", value: 0 },
  ]);

  // Example: Fetch stats (replace with actual hooks/data)
  // const { data: studentsData } = useGetAllUsers({
  //   page: 1,
  //   limit: 10,
  //   role: "USER",
  //   filterBy: "Active",
  // });

  // useEffect(() => {
  //   // Mock stats data (replace with real API calls)
  //   setStats([
  //     { title: "Total Courses", value: 5 }, // Replace with actual course count
  //     {
  //       title: "Active Students",
  //       value: studentsData?.total || 0,
  //     },
  //     { title: "Pending Requests", value: 2 }, // Replace with actual request count
  //   ]);
  // }, [studentsData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, { "Instructor"}!
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your courses, students, and analytics from here.
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
        <p className="text-gray-500 mt-2">
          Placeholder for recent activity (e.g., new student enrollments, course
          updates).
        </p>
      </div>
    </div>
  );
}
