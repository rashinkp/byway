"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  User,
  CheckCircle2,
  UserCircle,
} from "lucide-react";
import { UserProfileType } from "@/types/user";
import Image from 'next/image';
import { useSignedUrl } from "@/hooks/file/useSignedUrl";
import { useEffect } from "react";

interface ProfileSectionProps {
  user: UserProfileType;
  setIsModalOpen: (open: boolean) => void;
  isInstructor?: boolean;
}

export default function ProfileSection({
  user,
  setIsModalOpen,
}: ProfileSectionProps) {
  // Get signed URL for avatar
  const { url: avatarUrl, isLoading: avatarLoading, error: avatarError, refresh } = useSignedUrl(user.avatar);
  
  // Refresh signed URL when profile updates (e.g., after saving), even if key stays same
  useEffect(() => {
    if (user?.updatedAt) {
      void refresh();
    }
  }, [user?.updatedAt, refresh]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSkillsArray = (skills: string | string[] | undefined): string[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  const skillsArray = getSkillsArray(user.skills);

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar/Initial */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2 relative">
          {user.avatar ? (
            avatarLoading ? (
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse border-4 border-gray-200 dark:border-gray-700 shadow-md" />
            ) : avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={`${user.name}'s avatar`} 
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-[#232326]" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold bg-gray-200 dark:bg-gray-700 text-white border-4 border-gray-200 dark:border-gray-700 shadow-md">
                {user.name ? getInitials(user.name) : "U"}
              </div>
            )
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold bg-gray-200 dark:bg-gray-700 text-white border-4 border-gray-200 dark:border-gray-700 shadow-md">
              {user.name ? getInitials(user.name) : "U"}
            </div>
          )}
        </div>
        {/* Main Info */}
        <div className="flex-1 flex flex-col items-center md:items-start gap-2 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-1 text-center md:text-left">
              {user.name || "Anonymous User"}
            </h1>
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              variant="default"
              className="mt-2 md:mt-0"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
          <div className="flex items-center gap-2 justify-center md:justify-start w-full">
            <p className="text-gray-500 dark:text-gray-300 mb-2 text-center md:text-left flex items-center">
              {user.email}
              {user.isVerified && (
                <span className="ml-2" title="Verified">
                  <CheckCircle2 className="w-5 h-5 text-green-500 inline" />
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: 2 columns per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* About Me */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 dark:text-[#facc15]" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-[#facc15] uppercase tracking-wide">About Me</h3>
          </div>
          <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
            {user.bio || (
              <span className="italic text-gray-400">No biography provided yet</span>
            )}
          </p>
        </div>
        {/* Education */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 dark:text-[#facc15]" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-[#facc15] uppercase tracking-wide">Education</h3>
          </div>
          <p className="text-gray-900 dark:text-gray-100">
            {user.education || (
              <span className="italic text-gray-400">Not specified</span>
            )}
          </p>
        </div>
        {/* Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 dark:text-[#facc15]" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-[#facc15] uppercase tracking-wide">Skills & Expertise</h3>
          </div>
          {skillsArray.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill, index) => (
                <Badge variant={'secondary'} key={index} className="">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="italic text-gray-400">No skills listed yet</span>
          )}
        </div>
        {/* Date of Birth */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 dark:text-[#facc15]" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-[#facc15] uppercase tracking-wide">Date of Birth</h3>
          </div>
          <p className="text-gray-900 dark:text-gray-100">
            {user.dateOfBirth ? (
              formatDate(user.dateOfBirth)
            ) : (
              <span className="italic text-gray-400">Not specified</span>
            )}
          </p>
        </div>
        {/* Gender */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserCircle className="w-5 h-5 dark:text-[#facc15]" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-[#facc15] uppercase tracking-wide">Gender</h3>
          </div>
          <p className="text-gray-900 dark:text-gray-100">
            {user.gender ? user.gender.toUpperCase() : <span className="italic text-gray-400">Not specified</span>}
          </p>
        </div>
        {/* Contact Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 dark:text-[#facc15]" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-[#facc15] uppercase tracking-wide">Contact Info</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Phone Number</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {user.phoneNumber || (
                    <span className="italic text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Location</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {[user.address, user.city, user.country].filter(Boolean).length > 0 ? (
                    [user.address, user.city, user.country].filter(Boolean).join(", ")
                  ) : (
                    <span className="italic text-gray-400">Not specified</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
