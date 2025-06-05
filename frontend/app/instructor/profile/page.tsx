"use client";

import ProfileSection from "@/components/profile/ProfileSection";
import EditProfileForm from "@/components/profile/EditProfileForm";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useDetailedUserData } from "@/hooks/user/useDetailedUserData";

export default function InstructorProfilePage() {
  const { data: user, isLoading, error } = useDetailedUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Something went wrong</div>
        <p className="text-gray-600">{error instanceof Error ? error.message : "An error occurred"}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">No user data found</div>
        <p className="text-gray-600">Please try logging in again</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ProfileSection user={user} setIsModalOpen={setIsModalOpen} isInstructor={true} />
      <EditProfileForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        user={user}
        isInstructor={true}
      />
    </div>
  );
} 