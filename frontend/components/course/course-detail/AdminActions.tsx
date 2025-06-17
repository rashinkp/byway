import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  AlertCircle,
  Edit2,
  Loader2,
  Shield,
  Clock,
  DollarSign,
  Percent,
  Calendar,
  FileText,
  BookOpen,
} from "lucide-react";
import { Course } from "@/types/course";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminActionsProps {
  course: Course;
  isApproving: boolean;
  isDeclining: boolean;
  isTogglingStatus: boolean;
  onApprove: () => void;
  onDecline: () => void;
  onToggleStatus: () => void;
}

export default function AdminActions({
  course,
  isApproving,
  isDeclining,
  isTogglingStatus,
  onApprove,
  onDecline,
  onToggleStatus,
}: AdminActionsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-900 mb-6">
        <CheckCircle2 className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Admin Actions</h2>
      </div>

      {/* Course Status Badges */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Course Status</h3>
        <div className="flex flex-wrap gap-2">
          {/* Course Status Badge */}
          <Badge className={`${
            course.deletedAt 
              ? 'bg-red-100 text-red-800 hover:bg-red-100' 
              : course.status === 'PUBLISHED'
              ? 'bg-green-100 text-green-800 hover:bg-green-100'
              : course.status === 'DRAFT'
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
              : course.status === 'ARCHIVED'
              ? 'bg-gray-100 text-gray-800 hover:bg-gray-100'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
          }`}>
            {course.deletedAt ? 'Deleted' : course.status || 'Unknown'}
          </Badge>

          {/* Approval Status Badge */}
          <Badge className={`${
            course.approvalStatus === 'APPROVED'
              ? 'bg-green-100 text-green-800 hover:bg-green-100'
              : course.approvalStatus === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
              : course.approvalStatus === 'DECLINED'
              ? 'bg-red-100 text-red-800 hover:bg-red-100'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
          }`}>
            {course.approvalStatus || 'No Status'}
          </Badge>

          {/* Deleted At Info */}
          {course.deletedAt && (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
              Deleted: {new Date(course.deletedAt).toLocaleDateString()}
            </Badge>
          )}

          {/* Created At Info */}
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Created: {new Date(course.createdAt).toLocaleDateString()}
          </Badge>
        </div>
      </Card>

      <Separator />

      <div className="space-y-4">
        {course.approvalStatus === 'PENDING' && (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  disabled={isApproving}
                  size="lg"
                  variant="outline"
                  className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                >
                  {isApproving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  Approve Course
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve Course</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve "{course.title}"? This will make the course available to students.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onApprove}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  disabled={isDeclining}
                  size="lg"
                  variant="outline"
                  className="w-full bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                >
                  {isDeclining ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-2" />
                  )}
                  Decline Course
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Decline Course</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to decline "{course.title}"? This will reject the course submission.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDecline}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Decline
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        {course.approvalStatus === 'APPROVED' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                disabled={isTogglingStatus}
                size="lg"
                variant="outline"
                className="w-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                {isTogglingStatus ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Edit2 className="w-4 h-4 mr-2" />
                )}
                {course?.deletedAt ? 'Enable Course' : 'Disable Course'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {course?.deletedAt ? 'Enable Course' : 'Disable Course'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to {course?.deletedAt ? 'enable' : 'disable'} "{course.title}"? 
                  {course?.deletedAt 
                    ? ' This will make the course available to students again.' 
                    : ' This will hide the course from students.'
                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onToggleStatus}
                  className={course?.deletedAt ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                >
                  {course?.deletedAt ? 'Enable' : 'Disable'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
} 