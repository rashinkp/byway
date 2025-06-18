import React from "react";
import { Check, X, Download, Trash2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { InstructorDetailBase } from "./InstructorDetailBase";
import { IInstructorDetails } from "@/types/instructor";
import { Course } from "@/types/course";
import InstructorActions from "./InstructorActions";

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

  // Create InstructorActions component for sidebar
  const instructorActionsComponent = (
    <InstructorActions
      instructor={instructor}
      onApprove={onApprove}
      onDecline={onDecline}
      onToggleDelete={onToggleDelete}
      onDownloadCV={onDownloadCV}
    />
  );

  return (
    <InstructorDetailBase
      instructor={instructor}
      courses={courses}
      isCoursesLoading={isCoursesLoading}
      renderStatusBadges={renderStatusBadges}
      sidebarProps={{
        adminActions: instructorActionsComponent,
        userRole: "ADMIN",
      }}
    />
  );
}; 