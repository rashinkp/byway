import React, { useState } from "react";
import { Check, X, Download, Trash2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { InstructorDetailBase } from "./InstructorDetailBase";
import { IInstructorDetails } from "@/types/instructor";
import { Course } from "@/types/course";

interface AdminInstructorDetailProps {
  instructor: IInstructorDetails;
  courses?: Course[];
  isCoursesLoading?: boolean;
  onApprove: () => Promise<void>;
  onDecline: () => Promise<void>;
  onToggleDelete: () => void;
  onDownloadCV: () => void;
}

export const AdminInstructorDetail: React.FC<AdminInstructorDetailProps> = ({
  instructor,
  courses,
  isCoursesLoading,
  onApprove,
  onDecline,
  onToggleDelete,
  onDownloadCV,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      APPROVED: { bg: "bg-green-100", text: "text-green-800", icon: Check },
      REJECTED: { bg: "bg-red-100", text: "text-red-800", icon: X },
      ENABLED: { bg: "bg-green-100", text: "text-green-800", icon: Check },
      DISABLED: { bg: "bg-red-100", text: "text-red-800", icon: X },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: AlertCircle,
    };
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

  const renderStatusBadges = () => (
    <>
      {getStatusBadge(instructor.status)}
      {getStatusBadge(instructor.deletedAt ? "DISABLED" : "ENABLED")}
    </>
  );

  const renderHeaderActions = () => (
    <>
      {instructor.status === "PENDING" && (
        <>
          <button
            onClick={onApprove}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="w-4 h-4 mr-2" />
            Approve
          </button>
          <button
            onClick={onDecline}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Decline
          </button>
        </>
      )}
      {instructor.status === "DECLINED" && (
        <button
          onClick={onApprove}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Check className="w-4 h-4 mr-2" />
          Approve
        </button>
      )}
      <button
        onClick={onDownloadCV}
        className={`flex items-center px-4 py-2 ${
          instructor.cv && instructor.cv !== "No CV provided"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        } text-white rounded-lg transition-colors`}
        disabled={!instructor.cv || instructor.cv === "No CV provided"}
      >
        <Download className="w-4 h-4 mr-2" />
        {instructor.cv && instructor.cv !== "No CV provided" ? "Download CV" : "No CV Available"}
      </button>
      <button
        onClick={() => setShowDeleteModal(true)}
        className={`flex items-center px-4 py-2 ${
          instructor.deletedAt 
            ? "bg-green-600 hover:bg-green-700" 
            : "bg-red-600 hover:bg-red-700"
        } text-white rounded-lg transition-colors`}
      >
        {instructor.deletedAt ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <X className="w-4 h-4 mr-2" />
        )}
        {instructor.deletedAt ? "Enable" : "Disable"}
      </button>
    </>
  );

  return (
    <>
      <InstructorDetailBase
        instructor={instructor}
        courses={courses}
        isCoursesLoading={isCoursesLoading}
        renderHeaderActions={renderHeaderActions}
        renderStatusBadges={renderStatusBadges}
      />

      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Instructor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {instructor.deletedAt ? "enable" : "disable"} the instructor "{instructor.name || instructor.email}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onToggleDelete}>
              {instructor.deletedAt ? "Enable" : "Disable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}; 