"use client";

import { useState } from "react";
import { useDetailedUserData } from "@/hooks/user/useDetailedUserData";
import Sidebar from "@/components/profile/SideBarProfile";
import ProfileSection from "@/components/profile/ProfileSection";
import EditProfileForm from "@/components/profile/EditProfileForm";
import MyCoursesPage from "../my-courses/page";
import WalletTransactionPage from "../wallet/page";
import TransactionsPage from "../transactions/page";
import OrderListing from "../my-orders/page";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: user, isLoading, error } = useDetailedUserData();
  const [activeSection, setActiveSection] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-2">Something went wrong</div>
          <p className="text-gray-600">{error instanceof Error ? error.message : "An error occurred"}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-2">No user data found</div>
          <p className="text-gray-600">Please try logging in again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {activeSection === "profile" && (
              <ProfileSection user={user} setIsModalOpen={setIsModalOpen} />
            )}

            {activeSection === 'courses' && (
              <MyCoursesPage />
            )}
            {activeSection === 'wallet' && (
              <WalletTransactionPage />
            )}
            {activeSection === 'transactions' && (
              <TransactionsPage />
            )}
            {activeSection === 'orders' && (
              <OrderListing />
            )}
            {["certificates", "settings"].map(
              (section) =>
                activeSection === section && (
                  <div key={section} className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-gray-800 capitalize mb-2">
                      {section}
                    </h2>
                    <div className="h-px bg-gray-200 my-4" />
                    <p className="text-gray-600">
                      Content for {section} section coming soon...
                    </p>
                  </div>
                )
            )}
          </div>
        </main>
      </div>
      <EditProfileForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        user={user}
      />
    </div>
  );
}
