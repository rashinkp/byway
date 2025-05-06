'use client'

import React, { useState } from "react";
import SidebarProfile from "./SideBarProfile";
import ProfileSection from "./ProfileSection";


// Define the interface for props
interface ProfileCardProps {
  name?: string;
  avatar?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  skills?: string[];
  role?: string;
  education?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  sidebarLinks?: { label: string; href: string }[];
  error?: string;
}

// Main ProfileCard component
const ProfileCard: React.FC<ProfileCardProps> = ({
  name = "John Doe",
  avatar = "/default-avatar.png",
  email = "john.doe@example.com",
  phoneNumber = "",
  bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  skills = [],
  role = "USER",
  education = "",
  country = "",
  city = "",
  address = "",
  dateOfBirth = "",
  gender = "",
  isVerified = false,
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
  sidebarLinks = [
    { label: "PROFILE", href: "#" },
    { label: "MY COURSES", href: "#" },
    { label: "TEACHERS", href: "#" },
    { label: "MESSAGE", href: "#" },
    { label: "MY REVIEWS", href: "#" },
    { label: "CERTIFICATES", href: "#" },
  ],
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const userData = {
    name,
    avatar,
    email,
    phoneNumber,
    bio,
    skills,
    role,
    education,
    country,
    city,
    address,
    dateOfBirth,
    gender,
    isVerified,
    createdAt,
    updatedAt,
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarProfile name={name} avatar={avatar} sidebarLinks={sidebarLinks} />
      <ProfileSection
        userData={userData}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
};

export default ProfileCard;
