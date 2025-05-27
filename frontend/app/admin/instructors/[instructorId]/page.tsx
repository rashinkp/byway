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

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
  authProvider: "EMAIL_PASSWORD" | "GOOGLE" | "FACEBOOK";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InstructorDetails {
  id: string;
  userId: string;
  totalStudents: number;
  areaOfExpertise: string;
  professionalExperience: string;
  about?: string;
  website?: string;
  education: string;
  certifications: string;
  cv: string; // PDF URL
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

interface InstructorProfile {
  user: User;
  instructorDetails: InstructorDetails;
  totalCourses: number;
  totalReviews: number;
  averageRating: number;
}

const InstructorProfilePage: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    expertise: true,
    experience: true,
    education: true,
    certifications: true,
  });

  // Sample data - replace with actual data from your API
  const instructorProfile: InstructorProfile = {
    user: {
      id: "1",
      name: "Ronald Richards",
      email: "ronald.richards@example.com",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      role: "INSTRUCTOR",
      authProvider: "EMAIL_PASSWORD",
      isVerified: true,
      createdAt: "2023-01-15T10:00:00Z",
      updatedAt: "2024-01-20T15:30:00Z",
    },
    instructorDetails: {
      id: "inst-1",
      userId: "1",
      totalStudents: 1000,
      areaOfExpertise:
        "User Experience (UX) Design, User Interface (UI) Design, Information Architecture, Interaction Design, Visual Design, Usability Testing, Wireframing and Prototyping, Design Thinking",
      professionalExperience:
        "Ronald Richards has an extensive professional background in UX/UI design, having worked with renowned companies such as Google, Apple, and Microsoft. His portfolio includes a diverse range of projects spanning web applications, mobile apps, and e-commerce platforms. With over 10 years of industry experience, Ronald has led design teams and collaborated with cross-functional teams to deliver user-centered solutions that drive business growth.",
      about:
        "Ronald Richard is a highly skilled UX/UI Designer with over a decade of experience in crafting user-centric digital solutions. With a background in graphic design and a keen eye for detail, Ronald specializes in creating intuitive interfaces that delight users and drive business results.",
      website: "https://ronaldrichards.design",
      education:
        "Master of Fine Arts in Graphic Design - Stanford University (2010-2012), Bachelor of Arts in Visual Communication - University of California, Berkeley (2006-2010)",
      certifications:
        "Certified Usability Analyst (CUA) - Human Factors International, Google UX Design Professional Certificate, Adobe Certified Expert (ACE) in Adobe XD, Scrum Master Certification (CSM)",
      cv: "https://example.com/ronald-richards-cv.pdf",
      status: "PENDING",
      createdAt: "2023-01-15T10:00:00Z",
      updatedAt: "2024-01-20T15:30:00Z",
    },
    totalCourses: 154,
    totalReviews: 154,
    averageRating: 4.8,
  };

  const handleApprove = () => {
    console.log("Approving instructor:", instructorProfile.user.id);
    // Implement approval logic
  };

  const handleDecline = () => {
    console.log("Declining instructor:", instructorProfile.user.id);
    // Implement decline logic
  };

  const handleDelete = () => {
    console.log("Deleting instructor:", instructorProfile.user.id);
    setShowDeleteModal(false);
    // Implement delete logic
  };

  const handleDownloadCV = () => {
    window.open(instructorProfile.instructorDetails.cv, "_blank");
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
          <p className="text-gray-700 leading-relaxed">{content}</p>
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
                    src={
                      instructorProfile.user.avatar ||
                      "/api/placeholder/120/120"
                    }
                    alt={instructorProfile.user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {instructorProfile.user.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {instructorProfile.user.name}
                    </h1>
                    {getStatusBadge(instructorProfile.instructorDetails.status)}
                  </div>
                  <p className="text-gray-600 mb-4">
                    Web Developer, UX/UI Designer, and Teacher
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {instructorProfile.instructorDetails.totalStudents}
                      </div>
                      <div className="text-sm text-gray-500">
                        Total Students
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {instructorProfile.totalReviews}
                      </div>
                      <div className="text-sm text-gray-500">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {instructorProfile.totalCourses}
                      </div>
                      <div className="text-sm text-gray-500">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-2xl font-bold text-gray-900">
                          {instructorProfile.averageRating}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">Rating</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {instructorProfile.user.email}
                    </div>
                    {instructorProfile.instructorDetails.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        <a
                          href={instructorProfile.instructorDetails.website}
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
                      Joined {formatDate(instructorProfile.user.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex flex-col space-y-3">
                {instructorProfile.instructorDetails.status === "PENDING" && (
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
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {instructorProfile.instructorDetails.about && (
            <ExpandableSection
              title="About Ronald Richards"
              content={instructorProfile.instructorDetails.about}
              sectionKey="about"
              icon={User}
            />
          )}

          <ExpandableSection
            title="Areas of Expertise"
            content={instructorProfile.instructorDetails.areaOfExpertise}
            sectionKey="expertise"
            icon={Award}
          />

          <ExpandableSection
            title="Professional Experience"
            content={instructorProfile.instructorDetails.professionalExperience}
            sectionKey="experience"
            icon={BookOpen}
          />

          <ExpandableSection
            title="Education"
            content={instructorProfile.instructorDetails.education}
            sectionKey="education"
            icon={Award}
          />

          <ExpandableSection
            title="Certifications"
            content={instructorProfile.instructorDetails.certifications}
            sectionKey="certifications"
            icon={FileText}
          />

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
                  {instructorProfile.user.id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auth Provider
                </label>
                <p className="text-gray-900">
                  {instructorProfile.user.authProvider.replace("_", " ")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <p className="text-gray-900">{instructorProfile.user.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Status
                </label>
                <p className="text-gray-900">
                  {instructorProfile.user.isVerified ? (
                    <span className="inline-flex items-center text-green-600">
                      <Check className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-600">
                      <X className="w-4 h-4 mr-1" />
                      Not Verified
                    </span>
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <p className="text-gray-900">
                  {formatDate(instructorProfile.user.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="text-gray-900">
                  {formatDate(instructorProfile.user.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Instructor
                  </h3>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete{" "}
                <strong>{instructorProfile.user.name}</strong>? This will
                permanently remove their profile, courses, and all associated
                data.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorProfilePage;
