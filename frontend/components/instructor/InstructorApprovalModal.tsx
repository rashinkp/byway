"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useApproveInstructor } from "@/hooks/instructor/useApproveInstructor";
import { useDeclineInstructor } from "@/hooks/instructor/useDeclineInstructor";
import { IInstructorDetails } from "@/types/instructor";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";

export function InstructorApprovalModal() {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, refetch } = useGetAllInstructors();
  const { mutate: approveInstructor } = useApproveInstructor();
  const { mutate: declineInstructor } = useDeclineInstructor();

  const pendingInstructors =
    data?.data?.filter(
      (instructor: IInstructorDetails) => instructor.status === "PENDING"
    ) || [];

  const handleApprove = (instructorId: string) => {
    approveInstructor(instructorId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleDecline = (instructorId: string) => {
    declineInstructor(instructorId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
        >
          Review Pending Instructors
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Pending Instructor Approvals</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : pendingInstructors.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No pending instructor approvals
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {pendingInstructors.map((instructor: IInstructorDetails) => (
                <div
                  key={instructor.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{instructor.areaOfExpertise}</p>
                    <p className="text-sm text-gray-500">
                      {instructor.professionalExperience}
                    </p>
                    <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                      {instructor.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(instructor.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDecline(instructor.id)}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
