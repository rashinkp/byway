"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { ReactNode, useCallback } from "react";
import { AlertDialogFooter, AlertDialogHeader } from "./alert-dialog";

interface AlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string | ((item: any) => string) | ReactNode;
  confirmText?: string;
  cancelText?: string | null;
  onConfirm: () => void;
  item?: any;
  actions?: Array<{ confirmationMessage?: (item: any) => string }>;
  actionIndex?: number;
}

export function AlertComponent({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  item,
  actions,
  actionIndex,
}: AlertProps) {
  const getDynamicDescription = useCallback(() => {
    if (
      item &&
      actions &&
      actionIndex !== undefined &&
      actionIndex >= 0 &&
      actionIndex < actions.length
    ) {
      return actions[actionIndex]?.confirmationMessage?.(item) || description;
    }
    if (typeof description === "function") {
      return description(item);
    }
    return description;
  }, [item, actions, actionIndex, description]);

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogOverlay className="fixed inset-0 bg-black/50 z-50" />
      <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/80 dark:bg-[#232323] border border-gray-200 dark:border-gray-700 p-6 shadow-lg max-w-md w-full z-50">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-black dark:text-[#facc15]">
            {title}
          </AlertDialogTitle>

          {typeof getDynamicDescription() === "string" ? (
            <AlertDialogDescription className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {getDynamicDescription() as string}
            </AlertDialogDescription>
          ) : (
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {getDynamicDescription() as string}
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex justify-end gap-2">
          {cancelText && (
            <AlertDialogCancel className="px-4 py-2 text-sm font-medium text-black dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md">
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-black dark:text-[#18181b] bg-[#facc15] hover:bg-yellow-400 dark:bg-[#facc15] dark:hover:bg-yellow-400 rounded-md"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
