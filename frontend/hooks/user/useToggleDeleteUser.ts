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
        return {
          ...user,
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    },
    onMutate: async (user) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users"] });
      await queryClient.cancelQueries({ queryKey: ["user-admin-details", user.id] });
      
      // Get the current data
      const previousUsersData = queryClient.getQueryData<ApiResponse<IPaginatedResponse<User>>>(["users"]);
      const previousUserDetails = queryClient.getQueryData<User>(["user-admin-details", user.id]);
      
      // Optimistically update the users list cache
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
                    deletedAt: !u.deletedAt ? new Date().toISOString() : null,
                    updatedAt: new Date().toISOString(),
                  }
                : u
            ),
          },
        };
      });

      // Optimistically update the user details cache
      queryClient.setQueryData<User>(["user-admin-details", user.id], (old) => {
        if (!old) return old;
        return {
          ...old,
          deletedAt: !old.deletedAt ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        };
      });

      return { previousUsersData, previousUserDetails };
    },
    onSuccess: (updatedUser, user) => {
      // Update the users list cache with the actual response
      queryClient.setQueryData<ApiResponse<IPaginatedResponse<User>>>(["users"], (old) => {
        if (!old || !old.data || !old.data.items) {
          return old;
        }
        
        const updatedItems = old.data.items.map((u) =>
          u.id === user.id ? updatedUser as User : u
        );
        
        return {
          ...old,
          data: {
            ...old.data,
            items: updatedItems,
          },
        };
      });

      // Update the user details cache
      queryClient.setQueryData<User>(["user-admin-details", user.id], updatedUser as User);
      
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
      if (context?.previousUsersData) {
        queryClient.setQueryData(["users"], context.previousUsersData);
      }
      if (context?.previousUserDetails) {
        queryClient.setQueryData(["user-admin-details", user.id], context.previousUserDetails);
      }
      
      toast.error(
        `Failed to ${user.deletedAt ? "restore" : "delete"} user`,
        {
          description: error.message || "Please try again",
        }
      );
    },
    onSettled: () => {
      // Invalidate and refetch both queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-admin-details"] });
    },
  });
}