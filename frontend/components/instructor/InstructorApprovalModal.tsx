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
import { useApproveInstructor } from "@/hooks/instructor/useApproveInstructor";
import { useDeclineInstructor } from "@/hooks/instructor/useDeclineInstructor";
import { IInstructorWithUserDetails } from "@/types/instructor";
import { Loader2, Info } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";

export function InstructorApprovalModal() {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, refetch } = useGetAllInstructors();
  const { mutate: approveInstructor } = useApproveInstructor();
  const { mutate: declineInstructor } = useDeclineInstructor();

  const pendingInstructors =
    data?.data?.filter(
      (item: IInstructorWithUserDetails) =>
        item.instructor?.status === "PENDING"
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
    <Tooltip.Provider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
          >
            Review Pending Instructors
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] z-50">
          <DialogHeader>
            <DialogTitle>Pending Instructor Approvals</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : pendingInstructors.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No pending instructor approvals
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {pendingInstructors.map(
                  ({ instructor, user }: IInstructorWithUserDetails) =>
                    instructor && (
                      <div
                        key={instructor.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
                      >
                        <div className="flex-1 flex items-center gap-3">
                          <div>
                            <p className="font-medium text-gray-800 text-lg">
                              {user.name || "Unnamed Instructor"}
                            </p>
                            <p className="text-sm font-semibold text-blue-600">
                              {instructor.areaOfExpertise}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {instructor.professionalExperience}
                            </p>
                          </div>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button className="text-gray-500 hover:text-blue-600">
                                <Info className="h-4 w-4" />
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                className="bg-gray-900 text-white text-sm rounded-lg p-4 max-w-xs shadow-xl border border-gray-700 z-[1000]"
                                side="top"
                                sideOffset={8}
                                align="center"
                              >
                                <div className="space-y-2">
                                  <p className="font-semibold">
                                    <span className="text-gray-300">
                                      Email:
                                    </span>{" "}
                                    {user.email}
                                  </p>
                                  {instructor.about && (
                                    <p className="font-semibold">
                                      <span className="text-gray-300">
                                        About:
                                      </span>{" "}
                                      {instructor.about}
                                    </p>
                                  )}
                                  {instructor.website && (
                                    <p className="font-semibold">
                                      <span className="text-gray-300">
                                        Website:
                                      </span>{" "}
                                      <a
                                        href={instructor.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline hover:text-blue-400"
                                      >
                                        {instructor.website}
                                      </a>
                                    </p>
                                  )}
                                  <p className="font-semibold">
                                    <span className="text-gray-300">
                                      Status:
                                    </span>{" "}
                                    <span className="text-yellow-400">
                                      {instructor.status}
                                    </span>
                                  </p>
                                  <p className="font-semibold">
                                    <span className="text-gray-300">
                                      Joined:
                                    </span>{" "}
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <Tooltip.Arrow className="fill-gray-900" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(instructor.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDecline(instructor.id)}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Tooltip.Provider>
  );
}
