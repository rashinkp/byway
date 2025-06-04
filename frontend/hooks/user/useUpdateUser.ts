"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user";
import { updateUser } from "@/api/users";
import { toast } from "sonner";

interface UseUpdateUserReturn {
  mutate: (data: {
    name?: string;
    avatar?: string;
    bio?: string;
    education?: string;
    skills?: string;
    phoneNumber?: string;
    country?: string;
    city?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
  }) => void;
  isLoading: boolean;
  error: { message: string; code?: string } | null;
}

export function useUpdateUser(): UseUpdateUserReturn {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    User,
    Error,
    {
      name?: string;
      avatar?: string;
      bio?: string;
      education?: string;
      skills?: string;
      phoneNumber?: string;
      country?: string;
      city?: string;
      address?: string;
      dateOfBirth?: string;
      gender?: "MALE" | "FEMALE" | "OTHER";
    }
  >({
    mutationFn: updateUser,
    onSuccess: (data) => {
      // Invalidate the userData query to refetch the updated user data
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      queryClient.invalidateQueries({ queryKey: ["detailedUserData"] });
      toast.success("Success",{
        description: "Your profile has been updated successfully."
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while updating your profile."
      });
    },
  });

  const mappedError = error
    ? {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        code:
          error instanceof Error && "code" in error
            ? (error as any).code
            : undefined,
      }
    : null;

  return {
    mutate,
    isLoading: isPending,
    error: mappedError,
  };
}
