"use client";

import { useState } from "react";
import { useUserData } from "@/hooks/user/useUserData";
import { cn } from "@/utils/cn";
import Sidebar from "@/components/profile/SideBarProfile";
import ProfileSection from "@/components/profile/ProfileSection";
import EditProfileForm from "@/components/profile/EditProfileForm";
import MyCoursesPage from "../my-courses/page";
import WalletTransactionPage from "../wallet/page";
import TransactionsPage from "../transactions/page";

export default function ProfilePage() {
  const { data: user, isLoading, error } = useUserData();
  const [activeSection, setActiveSection] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="flex-1 p-8">
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
        {["certificates", "settings"].map(
          (section) =>
            activeSection === section && (
              <div key={section} className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {section}
                </h2>
                <p className="mt-4 text-gray-600">
                  Content for {section} section coming soon...
                </p>
              </div>
            )
        )}
      </main>
      <EditProfileForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        user={user}
      />
    </div>
  );
}
