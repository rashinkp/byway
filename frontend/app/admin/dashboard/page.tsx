"use client";

// import { useAuthStore } from "@/lib/stores/authStore";

export default function AdminDashboard() {
  // const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome, </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Overview</h2>
        <p className="text-gray-600">
          Manage students, instructors, and courses from the sidebar.
        </p>
      </div>
    </div>
  );
}
