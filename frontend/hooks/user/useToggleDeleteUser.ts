"use client";

import { User } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteUser, recoverUser } from "@/api/users";
import { ApiResponse, IPaginatedResponse } from "@/types/apiResponse";

export function useToggleDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: User) => {
      if (user.deletedAt) {
        const result = await recoverUser(user.id);
        return result;
      } else {
        await deleteUser(user.id);
        return user;
      }
    },
    onMutate: async (user) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users"] });
      
      // Get the current data
      const previousData = queryClient.getQueryData<ApiResponse<IPaginatedResponse<User>>>(["users"]);
      
      // Optimistically update the cache
      queryClient.setQueryData<ApiResponse<IPaginatedResponse<User>>>(["users"], (old) => {
        if (!old || !old.data || !old.data.items) {
          return old;
        }
        
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((u) =>
              u.id === user.id
                ? {
                    ...u,
                    deletedAt: !u.deletedAt ? new Date() : null,
                    updatedAt: new Date(),
                  }
                : u
            ),
          },
        };
      });

      return { previousData };
    },
    onSuccess: (updatedUser, user) => {
      // Update the cache with the actual response
      queryClient.setQueryData<ApiResponse<IPaginatedResponse<User>>>(["users"], (old) => {
        if (!old || !old.data || !old.data.items) {
          return old;
        }
        
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((u) =>
              u.id === user.id ? updatedUser : u
            ),
          },
        };
      });
      
      toast.success(
        user.deletedAt ? "User unblocked successfully" : "User blocked successfully", {
          description: user.deletedAt
            ? "The user has been unblocked successfully."
            : "The user has been blocked successfully.",
        }
      );
    },
    onError: (error: any, user, context: any) => {
      // Revert to the previous state on error
      if (context?.previousData) {
        queryClient.setQueryData(["users"], context.previousData);
      }
      
      toast.error(
        `Failed to ${user.deletedAt ? "restore" : "delete"} user`,
        {
          description: error.message || "Please try again",
        }
      );
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}