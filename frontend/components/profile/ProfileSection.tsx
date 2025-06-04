"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  UserCircle
} from "lucide-react";
import { UserProfileType } from "@/types/user";

interface ProfileSectionProps {
  user: UserProfileType;
  setIsModalOpen: (open: boolean) => void;
}

export default function ProfileSection({ user, setIsModalOpen }: ProfileSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSkillsArray = (skills: string | string[] | undefined): string[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    return skills.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  const skillsArray = getSkillsArray(user.skills);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                {user.avatar ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden">
                    <img 
                      src={user.avatar} 
                      alt={`${user.name}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                <div className="w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold">
                  {user.name ? getInitials(user.name) : "U"}
                </div>
                )}
                {user.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">{user.name || 'Anonymous User'}</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline"
                    className="capitalize bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role.toLowerCase()}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={user.isVerified ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}
                  >
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
                  <Badge 
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    <UserCircle className="w-3 h-3 mr-1" />
                    {user.gender ? user.gender.toLowerCase() : 'Not specified'}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              size="lg"
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 text-gray-900">
                  <User className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">About Me</h2>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Biography</h3>
                  <p className="text-gray-800 leading-relaxed">
                    {user.bio || (
                      <span className="italic text-gray-400">
                        No biography provided yet
                      </span>
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Education</h3>
                      <p className="text-gray-800">
                        {user.education || (
                          <span className="italic text-gray-400">Not specified</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Date of Birth</h3>
                      <p className="text-gray-800">
                        {user.dateOfBirth ? (
                          formatDate(user.dateOfBirth)
                        ) : (
                          <span className="italic text-gray-400">Not specified</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Skills & Expertise</h3>
                    {skillsArray.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {skillsArray.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
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
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 text-gray-900">
                  <Mail className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Contact Info</h2>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                      <p className="text-gray-800 break-all">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                      <p className="text-gray-800">
                        {user.phoneNumber || (
                          <span className="italic text-gray-400">Not provided</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                      <p className="text-gray-800">
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}