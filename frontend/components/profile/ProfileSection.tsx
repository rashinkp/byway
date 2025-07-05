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
  Shield,
  CheckCircle2,
  AlertCircle,
  UserCircle,
} from "lucide-react";
import { UserProfileType } from "@/types/user";

interface ProfileSectionProps {
  user: UserProfileType;
  setIsModalOpen: (open: boolean) => void;
  isInstructor?: boolean;
}

export default function ProfileSection({
  user,
  setIsModalOpen,
  isInstructor = false,
}: ProfileSectionProps) {
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
    <div className="w-full">
      {/* Header Card */}
      <div className="bg-[var(--color-surface)]/95 rounded-2xl shadow-lg border border-[var(--color-primary-light)]/20 p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar/Initial */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              className="w-24 h-24 rounded-full object-cover border-4 border-[var(--color-primary-light)] shadow-md bg-[var(--color-background)]"
            />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold bg-[var(--color-primary-light)] text-[var(--color-surface)] border-4 border-[var(--color-primary-light)] shadow-md">
              {user.name ? getInitials(user.name) : "U"}
            </div>
          )}
          {user.isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-[var(--color-primary-dark)] rounded-full p-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-surface)]" />
            </div>
          )}
        </div>
        {/* Main Info */}
        <div className="flex-1 flex flex-col items-center md:items-start gap-2">
          <h1 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-1 text-center md:text-left">
            {user.name || "Anonymous User"}
          </h1>
          <p className="text-[var(--color-muted)] mb-2 text-center md:text-left">{user.email}</p>
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
            <Badge variant="outline" className="capitalize bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] border-[var(--color-primary-light)]/40">
              <Shield className="w-3 h-3 mr-1" />
              {user.role.toLowerCase()}
            </Badge>
            <Badge variant="outline" className="bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] border-[var(--color-primary-light)]/40">
              {user.isVerified ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Pending
                </>
              )}
            </Badge>
            <Badge variant="outline" className="bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] border-[var(--color-primary-light)]/40">
              <UserCircle className="w-3 h-3 mr-1" />
              {user.gender ? user.gender.toLowerCase() : "Not specified"}
            </Badge>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            variant="outline"
            className="bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] border-[var(--color-primary-light)] hover:bg-[var(--color-primary-light)]/20 mt-4"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-[var(--color-surface)]/95 rounded-2xl shadow-lg border border-[var(--color-primary-light)]/20 p-8">
            <div className="flex items-center gap-2 text-[var(--color-primary-dark)] mb-4">
              <User className="w-5 h-5" />
              <h2 className="text-lg font-semibold">About Me</h2>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--color-muted)] uppercase tracking-wide mb-2">
                Biography
              </h3>
              <p className="text-[var(--color-primary-dark)] leading-relaxed">
                {user.bio || (
                  <span className="italic text-[var(--color-muted)]">
                    No biography provided yet
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="flex items-start gap-3">
                <div className="bg-[var(--color-primary-light)]/10 p-2 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[var(--color-muted)] uppercase tracking-wide mb-1">
                    Education
                  </h3>
                  <p className="text-[var(--color-primary-dark)]">
                    {user.education || (
                      <span className="italic text-[var(--color-muted)]">
                        Not specified
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-[var(--color-primary-light)]/10 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[var(--color-muted)] uppercase tracking-wide mb-1">
                    Date of Birth
                  </h3>
                  <p className="text-[var(--color-primary-dark)]">
                    {user.dateOfBirth ? (
                      formatDate(user.dateOfBirth)
                    ) : (
                      <span className="italic text-[var(--color-muted)]">
                        Not specified
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[var(--color-primary-light)]/10 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[var(--color-muted)] uppercase tracking-wide mb-3">
                  Skills & Expertise
                </h3>
                {skillsArray.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skillsArray.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-[var(--color-primary-light)]/10 text-[var(--color-primary)] border-[var(--color-primary-light)]"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="italic text-gray-400">
                    No skills listed yet
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-8">
          {/* Contact Information */}
          <div className="bg-[var(--color-surface)]/95 rounded-2xl shadow-lg border border-[var(--color-primary-light)]/20 p-8">
            <div className="flex items-center gap-2 text-[var(--color-primary-dark)] mb-4">
              <Mail className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Contact Info</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-[var(--color-primary-light)]/10 p-2 rounded-lg">
                  <Mail className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-muted)] mb-1">
                    Email Address
                  </p>
                  <p className="text-[var(--color-primary-dark)] break-all">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-[var(--color-primary-light)]/10 p-2 rounded-lg">
                  <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--color-muted)] mb-1">
                    Phone Number
                  </p>
                  <p className="text-[var(--color-primary-dark)]">
                    {user.phoneNumber || (
                      <span className="italic text-[var(--color-muted)]">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-[var(--color-primary-light)]/10 p-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--color-muted)] mb-1">
                    Location
                  </p>
                  <p className="text-[var(--color-primary-dark)]">
                    {[user.address, user.city, user.country].filter(Boolean)
                      .length > 0 ? (
                      [user.address, user.city, user.country]
                        .filter(Boolean)
                        .join(", ")
                    ) : (
                      <span className="italic text-[var(--color-muted)]">
                        Not specified
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
