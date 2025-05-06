"use client";

import ProfileCard from "@/components/profile/ProfileCard";
import { useUserData } from "@/hooks/user/useUserData";
import React from "react";

const ProfilePage: React.FC = () => {
  const { data: userData, isLoading, error } = useUserData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ProfileCard error={error.code || "FETCH_FAILED"} />;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return (
    <ProfileCard
      name={userData.name}
      avatar={userData.avatar}
      email={userData.email}
      phoneNumber={userData.userProfile?.phoneNumber}
      bio={userData.userProfile?.bio}
      skills={userData.userProfile?.skills?.split(",") || []}
      role={userData.role}
      education={userData.userProfile?.education}
      country={userData.userProfile?.country}
      city={userData.userProfile?.city}
      address={userData.userProfile?.address}
      dateOfBirth={userData.userProfile?.dateOfBirth}
      gender={userData.userProfile?.gender}
      isVerified={userData.isVerified}
      createdAt={userData.createdAt}
      updatedAt={userData.updatedAt}
    />
  );
};

export default ProfilePage;
