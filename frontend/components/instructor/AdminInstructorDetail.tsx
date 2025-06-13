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
      <Badge variant="outline" className={`${config.bg} ${config.text} border-0`}>
        <Icon className="w-4 h-4 mr-1" />
        {status}
      </Badge>
    );
  };

  const renderStatusBadges = () => (
    <div className="flex gap-2">
      {getStatusBadge(instructor.status)}
      {getStatusBadge(instructor.deletedAt ? "DISABLED" : "ENABLED")}
    </div>
  );

  const renderHeaderActions = () => (
    <div className="flex flex-wrap gap-2">
      {instructor.status === "PENDING" && (
        <>
          <button
            onClick={onApprove}
            className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Approve
          </button>
          <button
            onClick={onDecline}
            className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4 mr-1.5" />
            Decline
          </button>
        </>
      )}
      {instructor.status === "DECLINED" && (
        <button
          onClick={onApprove}
          className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
        >
          <Check className="w-4 h-4 mr-1.5" />
          Approve
        </button>
      )}
      <button
        onClick={onDownloadCV}
        className={`inline-flex items-center px-3 py-1.5 ${
          instructor.cv && instructor.cv !== "No CV provided"
            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        } rounded-md transition-colors text-sm font-medium`}
        disabled={!instructor.cv || instructor.cv === "No CV provided"}
      >
        <Download className="w-4 h-4 mr-1.5" />
        {instructor.cv && instructor.cv !== "No CV provided" ? "Download CV" : "No CV Available"}
      </button>
      <button
        onClick={() => setShowDeleteModal(true)}
        className={`inline-flex items-center px-3 py-1.5 ${
          instructor.deletedAt 
            ? "bg-green-100 text-green-800 hover:bg-green-200" 
            : "bg-red-100 text-red-800 hover:bg-red-200"
        } rounded-md transition-colors text-sm font-medium`}
      >
        {instructor.deletedAt ? (
          <Check className="w-4 h-4 mr-1.5" />
        ) : (
          <X className="w-4 h-4 mr-1.5" />
        )}
        {instructor.deletedAt ? "Enable" : "Disable"}
      </button>
    </div>
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