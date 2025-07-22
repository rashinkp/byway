import React, { useState } from "react";
import { Message as MessageType, EnhancedChatItem } from "@/types/chat";
import { MoreVertical, Trash2, Check, CheckCheck, Pause, Play, X } from "lucide-react";
import { AlertComponent } from "@/components/ui/AlertComponent";
import Image from 'next/image';

interface MessageProps {
  message: MessageType;
  currentUserId: string;
  chat: EnhancedChatItem;
  onDelete?: () => void;
}

export function Message({ message, currentUserId, chat, onDelete }: MessageProps) {
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
      className={`group flex items-start space-x-3 ${isMine ? "flex-row-reverse space-x-reverse" : "flex-row"}`}
      onMouseLeave={() => setMenuOpen(false)}
    >
      {/* Avatar - only show for other users */}
      {!isMine && (
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 ${getRoleColor(chat.role)} rounded-full flex items-center justify-center font-medium text-xs shadow-sm`}
          >
            {(chat.displayName?.charAt(0) || "?").toUpperCase()}
          </div>
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
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
              duration={typeof (message as any).duration === 'number' ? (message as any).duration : undefined}
            />
          )}
          {/* Image message */}
          {message.imageUrl && (
            <>
              <div
                className={`relative max-w-xs rounded-xl overflow-hidden shadow-sm transition-all duration-200 cursor-pointer ${
                  isMine
                    ? 'bg-[#facc15]/10 text-gray-900 dark:text-white border border-[#facc15]/30'
                    : 'bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white'
                }`}
                style={{ minWidth: '2.5rem' }}
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
                    className={`max-w-xs w-full object-cover rounded-lg transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                    style={{ display: imgError ? 'none' : undefined }}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setShowImagePreview(false)}>
                  <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
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
        <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"} w-full`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(message.timestamp)}
          </span>
        </div>
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
              if (onDelete) onDelete();
              setShowDeleteConfirm(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

function AudioMessage({ audioUrl, isMine, isRead, duration: messageDuration }: { audioUrl: string; isMine: boolean; isRead: boolean; duration?: number }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [audioError, setAudioError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Validate audio URL
  const isValidAudioUrl = React.useMemo(() => {
    if (!audioUrl) return false;
    try {
      const url = new URL(audioUrl);
      return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'blob:';
    } catch {
      return false;
    }
  }, [audioUrl]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isValidAudioUrl) {
      setAudioError(true);
      setIsLoading(false);
      return;
    }
    
    const update = () => setCurrentTime(audio.currentTime);
    const setDur = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      const error = target.error;
      let errorMessage = 'Audio playback failed';
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Audio loading was aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error while loading audio';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'Audio format not supported';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Audio source not supported';
            break;
          default:
            errorMessage = `Audio error: ${error.message || 'Unknown error'}`;
        }
      }
      setAudioError(true);
      setIsPlaying(false);
      setIsLoading(false);
      setErrorMessage(errorMessage);
    };
    const handleLoadStart = () => {
      setIsLoading(true);
      setAudioError(false);
      setErrorMessage('');
    };
    const handleCanPlay = () => {
      setIsLoading(false);
      setAudioError(false);
      setErrorMessage('');
    };

    audio.addEventListener('timeupdate', update);
    audio.addEventListener('loadedmetadata', setDur);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', update);
      audio.removeEventListener('loadedmetadata', setDur);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl, isValidAudioUrl]);

  // Use messageDuration as fallback
  React.useEffect(() => {
    if (!duration && messageDuration && !isLoading) {
      setDuration(messageDuration);
    }
  }, [duration, messageDuration, isLoading]);

  const togglePlayback = () => {
    if (!audioRef.current || audioError || isLoading) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        setAudioError(true);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const formatTime = (s: number) => {
    if (!isFinite(s) || isNaN(s) || s < 0) return '0:00';
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (audioError) {
    const isBlobUrl = audioUrl?.startsWith('blob:');
    const errorText = isBlobUrl 
      ? 'Audio file not available (temporary link expired)' 
      : errorMessage || 'Audio playback failed';
    
    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm text-sm ${
          isMine
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-700'
            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-700'
        }`}
        style={{ minWidth: 220, maxWidth: 360 }}
      >
        <span className="text-xs">{!isValidAudioUrl ? 'Invalid audio URL' : errorText}</span>
        {isMine && (
          <span className="ml-2 align-middle">
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
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm text-sm ${
        isMine
          ? 'bg-[#facc15]/10 text-gray-900 dark:text-white border border-[#facc15]/30'
          : 'bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white'
      }`}
      style={{ minWidth: 220, maxWidth: 360 }}
    >
      <button
        onClick={togglePlayback}
        disabled={isLoading}
        className={`focus:outline-none flex-shrink-0 hover:scale-110 transition-transform duration-150 ${
          isMine ? 'text-[#facc15]' : 'text-gray-600 dark:text-gray-300'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        type="button"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-[#facc15] border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>
      <span className="text-xs font-mono min-w-[60px] text-center flex-1 text-gray-600 dark:text-gray-300">
        {isLoading || !(duration > 0) ? (
          <span className="inline-block w-8 text-center">...</span>
        ) : isPlaying ? (
          `${formatTime(currentTime)} / ${formatTime(duration)}`
        ) : (
          formatTime(duration)
        )}
      </span>
      {isMine && (
        <span className="ml-2 align-middle flex-shrink-0">
          {isRead ? (
            <CheckCheck className="inline w-4 h-4 text-[#facc15]" />
          ) : (
            <Check className="inline w-4 h-4 text-[#facc15]" />
          )}
        </span>
      )}
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        style={{ display: 'none' }}
        preload="metadata"
        crossOrigin="anonymous"
      />
    </div>
  );
}