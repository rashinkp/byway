'use client'
import React, { useState } from "react";
import {
  User,
  Mail,
  Globe,
  Calendar,
  Users,
  Award,
  BookOpen,
  FileText,
  Download,
  Check,
  X,
  Trash2,
  Star,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useGetUserAdminDetails } from "@/hooks/user/useGetUserAdminDetails";
import { useToggleDeleteUser } from "@/hooks/user/useToggleDeleteUser";
import { approveInstructor, declineInstructor } from "@/api/instructor";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const InstructorProfilePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { data: userData, isLoading, error, refetch } = useGetUserAdminDetails(params.instructorId as string);
  const { mutate: toggleDeleteUser } = useToggleDeleteUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    about: false,
    expertise: false,
    experience: false,
    education: false,
    certifications: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !userData) {
    return <div>Error loading instructor profile</div>;
  }

  const instructorProfile = userData.instructor;
  if (!instructorProfile) {
    return <div>Not an instructor</div>;
  }

  const handleApprove = async () => {
    try {
      await approveInstructor(instructorProfile.id);
      // Refresh data after approval
      window.location.reload();
    } catch (error) {
      console.error("Error approving instructor:", error);
    }
  };

  const handleDecline = async () => {
    try {
      await declineInstructor(instructorProfile.id);
      // Refresh data after decline
      window.location.reload();
    } catch (error) {
      console.error("Error declining instructor:", error);
    }
  };

  const handleDelete = () => {
    if (userData) {
      toggleDeleteUser(userData, {
        onSuccess: () => {
          setShowDeleteModal(false);
          refetch();
        }
      });
    }
  };

  const handleDownloadCV = () => {
    if (instructorProfile.cv && instructorProfile.cv !== "No CV provided") {
      window.open(instructorProfile.cv, "_blank");
    } else {
      toast.error("No CV available for download");
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      APPROVED: { bg: "bg-green-100", text: "text-green-800", icon: Check },
      REJECTED: { bg: "bg-red-100", text: "text-red-800", icon: X },
      ENABLED: { bg: "bg-green-100", text: "text-green-800", icon: Check },
      DISABLED: { bg: "bg-red-100", text: "text-red-800", icon: X },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-4 h-4 mr-1" />
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const ExpandableSection: React.FC<{
    title: string;
    content: string;
    sectionKey: keyof typeof expandedSections;
    icon: React.ElementType;
  }> = ({ title, content, sectionKey, icon: Icon }) => (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
      >
        <div className="flex items-center">
          <Icon className="w-5 h-5 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-6 py-4">
          {content ? (
            <p className="text-gray-700 leading-relaxed">{content}</p>
          ) : (
            <p className="text-gray-500 italic">No {title.toLowerCase()} information provided</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <img
                    src={userData.avatar || "/api/placeholder/120/120"}
                    alt={userData.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {userData.name}
                    </h1>
                    {getStatusBadge(instructorProfile.status)}
                    {getStatusBadge(userData.deletedAt ? "DISABLED" : "ENABLED")}
                  </div>
                  <p className="text-gray-600 mb-4">
                    {instructorProfile.areaOfExpertise.split(',')[0]}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {userData.email}
                    </div>
                    {instructorProfile.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        <a
                          href={instructorProfile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Website
                        </a>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Joined {formatDate(userData.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex flex-col space-y-3">
                {instructorProfile.status === "PENDING" && (
                  <>
                    <button
                      onClick={handleApprove}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={handleDecline}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Decline
                    </button>
                  </>
                )}
                <button
                  onClick={handleDownloadCV}
                  className={`flex items-center px-4 py-2 ${
                    instructorProfile.cv && instructorProfile.cv !== "No CV provided"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white rounded-lg transition-colors`}
                  disabled={!instructorProfile.cv || instructorProfile.cv === "No CV provided"}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {instructorProfile.cv && instructorProfile.cv !== "No CV provided" ? "Download CV" : "No CV Available"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className={`flex items-center px-4 py-2 ${
                    userData.deletedAt 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-red-600 hover:bg-red-700"
                  } text-white rounded-lg transition-colors`}
                >
                  {userData.deletedAt ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <X className="w-4 h-4 mr-2" />
                  )}
                  {userData.deletedAt ? "Enable" : "Disable"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {instructorProfile.about && (
            <ExpandableSection
              title="About"
              content={instructorProfile.about}
              sectionKey="about"
              icon={User}
            />
          )}

          <ExpandableSection
            title="Areas of Expertise"
            content={instructorProfile.areaOfExpertise}
            sectionKey="expertise"
            icon={Award}
          />

          <ExpandableSection
            title="Professional Experience"
            content={instructorProfile.professionalExperience}
            sectionKey="experience"
            icon={BookOpen}
          />

          <ExpandableSection
            title="Education"
            content={instructorProfile.education}
            sectionKey="education"
            icon={Award}
          />

          <ExpandableSection
            title="Certifications"
            content={instructorProfile.certifications}
            sectionKey="certifications"
            icon={FileText}
          />

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 text-blue-600 mr-3" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData.bio ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <p className="text-gray-900">{userData.bio}</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <p className="text-gray-500 italic">No bio provided</p>
                </div>
              )}
              {userData.skills ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </label>
                  <p className="text-gray-500 italic">No skills provided</p>
                </div>
              )}
              {userData.phoneNumber ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900">{userData.phoneNumber}</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-500 italic">No phone number provided</p>
                </div>
              )}
              {userData.dateOfBirth ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <p className="text-gray-900">{formatDate(userData.dateOfBirth)}</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <p className="text-gray-500 italic">No date of birth provided</p>
                </div>
              )}
              {userData.gender ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <p className="text-gray-900">{userData.gender}</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <p className="text-gray-500 italic">No gender provided</p>
                </div>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 text-blue-600 mr-3" />
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData.country ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <p className="text-gray-900">{userData.country}</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <p className="text-gray-500 italic">No country provided</p>
                </div>
              )}
              {userData.city ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <p className="text-gray-900">{userData.city}</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <p className="text-gray-500 italic">No city provided</p>
                </div>
              )}
              {userData.address ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-gray-900">{userData.address}</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-gray-500 italic">No address provided</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-3" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <p className="text-gray-900 font-mono text-sm">
                  {userData.id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <p className="text-gray-900">{userData.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <p className="text-gray-900">
                  {formatDate(userData.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="text-gray-900">
                  {formatDate(userData.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Instructor</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {userData?.deletedAt ? "enable" : "disable"} the instructor "{userData?.name || userData?.email}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {userData?.deletedAt ? "Enable" : "Disable"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default InstructorProfilePage;
