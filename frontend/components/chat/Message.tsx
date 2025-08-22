import React, { useState } from "react";
import {
  MoreVertical,
  Trash2,
  Check,
  CheckCheck,
  Pause,
  Play,
  X,
} from "lucide-react";
import Image from "next/image";

// Mock types for the example
interface MessageType {
  id: string;
  senderId: string;
  content?: string;
  audioUrl?: string;
  imageUrl?: string;
  timestamp: string;
  isRead: boolean;
  duration?: number; // Added duration property
}

interface EnhancedChatItem {
  id: string;
  displayName?: string;
  role: string;
}

interface MessageProps {
  message: MessageType;
  currentUserId: string;
  chat: EnhancedChatItem;
  onDelete?: () => void;
}

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}

const ConfirmationDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
}: ConfirmationDialogProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export function Message({
  message,
  currentUserId,
  chat,
  onDelete,
}: MessageProps) {
  const isMine = message.senderId === currentUserId;
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-[#facc15] text-black";
      case "instructor":
        return "bg-green-500 text-white";
      case "user":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-300 text-gray-900";
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
      className={`group flex items-start space-x-3 ${
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
            )} rounded-full flex items-center justify-center font-medium text-xs shadow-sm`}
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
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {chat.displayName || "Unknown User"}
            </span>
          </div>
        )}

        {/* Message Bubble Row */}
        <div className="flex items-center gap-2">
          {/* Audio message */}
          {message.audioUrl && (
            <AudioMessage
              audioUrl={message.audioUrl}
              isMine={isMine}
              isRead={message.isRead}
              duration={message.duration}
            />
          )}

          {/* Image message */}
          {message.imageUrl && (
            <>
              <div
                className={`relative max-w-xs rounded-xl overflow-hidden shadow-sm transition-all duration-200 cursor-pointer ${
                  isMine
                    ? "bg-[#facc15]/10 text-gray-900 dark:text-white border border-[#facc15]/30"
                    : "bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                }`}
                style={{ minWidth: "2.5rem" }}
                onClick={() => setShowImagePreview(true)}
              >
                {!imgLoaded && !imgError && (
                  <div className="flex items-center justify-center w-full h-40 bg-gray-100 dark:bg-gray-700">
                    <span className="animate-spin w-6 h-6 border-4 border-[#facc15] border-t-transparent rounded-full"></span>
                  </div>
                )}
                {imgError && (
                  <div className="flex items-center justify-center w-full h-40 bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-300">
                    Failed to load image
                  </div>
                )}
                <div className="relative p-1 bg-transparent rounded-xl">
                  <Image
                    src={message.imageUrl}
                    alt="Sent image"
                    width={400}
                    height={300}
                    className={`max-w-xs w-full object-cover rounded-lg transition-opacity duration-300 ${
                      imgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                    style={{ display: imgError ? "none" : undefined }}
                  />
                  {/* Read/Unread tick for image messages (isMine only) */}
                  {isMine && imgLoaded && (
                    <span className="absolute bottom-2 right-2">
                      {message.isRead ? (
                        <CheckCheck className="inline w-4 h-4 text-[#facc15]" />
                      ) : (
                        <Check className="inline w-4 h-4 text-[#facc15]" />
                      )}
                    </span>
                  )}
                </div>
              </div>
              {/* Image Preview Modal */}
              {showImagePreview && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                  onClick={() => setShowImagePreview(false)}
                >
                  <div
                    className="relative max-w-3xl w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Image
                      src={message.imageUrl}
                      alt="Preview"
                      width={800}
                      height={600}
                      className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
                    />
                    <button
                      className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors duration-200"
                      onClick={() => setShowImagePreview(false)}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Text message */}
          {message.content && (
            <div
              className={`px-4 py-2 rounded-xl max-w-full whitespace-pre-wrap break-words text-sm shadow-sm ${
                isMine
                  ? "bg-[#facc15]/10 text-gray-900 dark:text-white border border-[#facc15]/30 rounded-br-sm"
                  : "bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-sm"
              }`}
              style={{ minWidth: "2.5rem" }}
            >
              {message.content}
              {isMine && (
                <span className="ml-2 align-middle">
                  {message.isRead ? (
                    <CheckCheck className="inline w-4 h-4 text-[#facc15]" />
                  ) : (
                    <Check className="inline w-4 h-4 text-[#facc15]" />
                  )}
                </span>
              )}
            </div>
          )}

          {isMine && (
            <div className="relative">
              <button
                className="p-1 rounded-full hover:bg-[#facc15]/10 text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => setMenuOpen((open) => !open)}
                tabIndex={-1}
                aria-label="Message options"
                type="button"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[120px] z-20">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 gap-2"
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

        {/* Timestamp */}
        <div
          className={`flex items-center gap-1 mt-1 ${
            isMine ? "justify-end" : "justify-start"
          } w-full`}
        >
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
          <ConfirmationDialog
            open={showDeleteConfirm}
            onOpenChange={setShowDeleteConfirm}
            title="Delete Message"
            description="Are you sure you want to delete this message? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={() => {
              if (onDelete) onDelete();
              setShowDeleteConfirm(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

function AudioMessage({
  audioUrl,
  isMine,
  isRead,
  duration: messageDuration,
}: {
  audioUrl: string;
  isMine: boolean;
  isRead: boolean;
  duration?: number;
}) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(messageDuration || 0);
  const [audioError, setAudioError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [audioLoaded, setAudioLoaded] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Validate audio URL
  const isValidAudioUrl = React.useMemo(() => {
    if (!audioUrl) return false;
    try {
      const url = new URL(audioUrl);
      return (
        url.protocol === "http:" ||
        url.protocol === "https:" ||
        url.protocol === "blob:"
      );
    } catch {
      return false;
    }
  }, [audioUrl]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isValidAudioUrl) {
      setAudioError(true);
      setIsLoading(false);
      setErrorMessage("Invalid audio URL");
      return;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      } else if (messageDuration && messageDuration > 0) {
        setDuration(messageDuration);
      }
      setIsLoading(false);
      setAudioLoaded(true);
      setAudioError(false);
    };

    const handleCanPlay = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
      setAudioLoaded(true);
      setAudioError(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      const error = target.error;
      let errorMessage = "Audio playback failed";

      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Audio loading was aborted";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "Network error while loading audio";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "Audio format not supported";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Audio source not supported";
            break;
          default:
            errorMessage = error.message || "Unknown audio error";
        }
      }

      setAudioError(true);
      setIsPlaying(false);
      setIsLoading(false);
      setAudioLoaded(false);
      setErrorMessage(errorMessage);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setAudioError(false);
      setErrorMessage("");
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);

    // Only call load() if not already loaded
    if (audio.readyState < 1) {
      audio.load();
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
    };
  }, [audioUrl, isValidAudioUrl, messageDuration]);

  React.useEffect(() => {
    if (
      messageDuration &&
      messageDuration > 0 &&
      (!duration || duration === 0)
    ) {
      setDuration(messageDuration);
    }
  }, [messageDuration, duration]);

  const togglePlayback = () => {
    if (!audioRef.current || audioError || isLoading || !audioLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (currentTime >= duration) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play().catch(() => {
        setAudioError(true);
        setErrorMessage("Failed to play audio" );
      });
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioLoaded || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (s: number) => {
    if (!isFinite(s) || isNaN(s) || s < 0) return "0:00";
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const showDuration = duration > 0 || (messageDuration && messageDuration > 0);
  const displayDuration = duration > 0 ? duration : messageDuration || 0;

  // Fallback: try to force load duration after a short delay if not available
  React.useEffect(() => {
    if (!showDuration && audioRef.current) {
      const timeout = setTimeout(() => {
        if (audioRef.current && (!audioRef.current.duration || isNaN(audioRef.current.duration))) {
          audioRef.current.load();
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [showDuration, audioUrl]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (audioError) {
    const isBlobUrl = audioUrl?.startsWith("blob:");
    const errorText = isBlobUrl
      ? "Audio file not available (temporary link expired)"
      : errorMessage || "Audio playback failed";

    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm text-sm ${
          isMine
            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-700"
            : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-700"
        }`}
        style={{ minWidth: 320, maxWidth: 520 }}
      >
        <div className="w-8 h-8 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
          <X className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs block truncate">
            {!isValidAudioUrl ? "Invalid audio URL" : errorText}
          </span>
        </div>
        {isMine && (
          <span className="ml-2 align-middle flex-shrink-0">
            {isRead ? (
              <CheckCheck className="inline w-4 h-4 text-red-600 dark:text-red-300" />
            ) : (
              <Check className="inline w-4 h-4 text-red-600 dark:text-red-300" />
            )}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-1 px-3 py-2 rounded-xl shadow-sm text-sm ${
        isMine
          ? "bg-[#facc15]/10 text-gray-900 dark:text-white border border-[#facc15]/30"
          : "bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
      }`}
      style={{ minWidth: 300, maxWidth: 480 }}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlayback}
          disabled={isLoading || !audioLoaded}
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            isMine
              ? "bg-[#facc15]/20 hover:bg-[#facc15]/30 text-[#facc15]"
              : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
          } ${
            isLoading || !audioLoaded
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-110"
          }`}
          aria-label={isPlaying ? "Pause" : "Play"}
          type="button"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
        <div className="flex-1">
          <div
            className="relative w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
          >
            <div
              className={`absolute h-full rounded-full transition-all duration-300 ${
                isMine ? "bg-[#facc15]" : "bg-gray-500 dark:bg-gray-400"
              }`}
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-full" />
          </div>
        </div>
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 min-w-[48px] text-right">
          {showDuration && isPlaying
            ? formatTime(currentTime)
            : showDuration
            ? formatTime(displayDuration)
            : isLoading
            ? 'Loading...'
            : <span className="animate-spin inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full align-middle" />}
        </span>
        {isMine && (
          <span className="ml-1 align-middle flex-shrink-0">
            {isRead ? (
              <CheckCheck className="inline w-4 h-4 text-[#facc15]" />
            ) : (
              <Check className="inline w-4 h-4 text-[#facc15]" />
            )}
          </span>
        )}
      </div>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="auto"
        crossOrigin="anonymous"
        style={{ display: "none" }}
      />
    </div>
  );
}
