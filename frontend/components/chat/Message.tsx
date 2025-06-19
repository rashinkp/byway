import React from "react";
import { Message as MessageType } from "@/types/chat";
import { EnhancedChatItem } from "@/types/chat";
import { MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { AlertComponent } from "@/components/ui/AlertComponent";

interface MessageProps {
  message: MessageType;
  currentUserId: string;
  chat: EnhancedChatItem;
}

export function Message({ message, currentUserId, chat }: MessageProps) {
  const isMine = message.senderId === currentUserId;
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-500";
      case "instructor":
        return "bg-blue-500";
      case "user":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div
      className={`group flex items-start space-x-2 ${
        isMine ? "flex-row-reverse space-x-reverse" : "flex-row"
      }`}
      onMouseLeave={() => setMenuOpen(false)}
    >
      {/* Avatar - only show for other users */}
      {!isMine && (
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 ${getRoleColor(
              chat.role
            )} rounded-full flex items-center justify-center text-white font-medium text-xs`}
          >
            {(chat.displayName?.charAt(0) || "?").toUpperCase()}
          </div>
        </div>
      )}

      {/* Message Content */}
      <div
        className={`max-w-[70%] ${
          isMine ? "items-end" : "items-start"
        } flex flex-col`}
      >
        {/* Sender Name - only show for other users */}
        {!isMine && (
          <div className="mb-1 px-1">
            <span className="text-xs font-medium text-gray-700">
              {chat.displayName || "Unknown User"}
            </span>
          </div>
        )}

        {/* Message Bubble Row (bubble + menu button for mine) */}
        <div className="flex items-center w-full justify-end relative">
          <div
            className={`px-4 py-2 rounded-2xl max-w-full whitespace-pre-wrap break-words text-sm ${
              isMine
                ? "bg-blue-500 text-white rounded-br-md"
                : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
            }`}
            style={{ minWidth: "2.5rem" }}
          >
            {message.content}
          </div>
          {isMine && (
            <div className="relative flex items-center">
              <button
                className="p-1 rounded-full hover:bg-blue-600/20 ml-0"
                onClick={() => setMenuOpen((open) => !open)}
                tabIndex={-1}
                aria-label="Message options"
                type="button"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded shadow-lg min-w-[120px] z-20">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 gap-2"
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setMenuOpen(false);
                    }}
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Row below bubble: timestamp and options */}
        <div
          className={`flex items-center gap-1 mt-1 ${
            isMine ? "justify-end" : "justify-start"
          } w-full`}
        >
          <span
            className={`text-xs ${isMine ? "text-gray-500" : "text-gray-700"}`}
          >
            {formatTime(message.timestamp)}
          </span>
          {/* Delete confirmation dialog */}
          {showDeleteConfirm && (
            <AlertComponent
              open={showDeleteConfirm}
              onOpenChange={setShowDeleteConfirm}
              title="Delete Message"
              description="Are you sure you want to delete this message? This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={() => {
                // TODO: implement actual delete logic
                setShowDeleteConfirm(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
