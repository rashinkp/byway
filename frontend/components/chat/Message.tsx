import React from "react";
import { Message as MessageType } from "@/types/chat";
import { EnhancedChatItem } from "@/types/chat";
import { MoreVertical, Trash2, Check, CheckCheck, Pause, Play, X } from "lucide-react";
import { useState } from "react";
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
        return "bg-[var(--color-primary-dark)]";
      case "instructor":
        return "bg-[var(--color-primary-light)]";
      case "user":
        return "bg-[var(--color-primary-light)]/60";
      default:
        return "bg-[var(--color-muted)]";
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
            )} rounded-full flex items-center justify-center text-[var(--color-surface)] font-medium text-xs`}
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
            <span className="text-xs font-medium text-[var(--color-muted)]">
              {chat.displayName || "Unknown User"}
            </span>
          </div>
        )}

        {/* Message Bubble Row (bubble + menu button for mine) */}
        <div className="flex items-center">
          {/* Audio message */}
          {message.audioUrl && (
            <>
              <AudioMessage
                audioUrl={message.audioUrl}
                isMine={isMine}
                isRead={message.isRead}
                duration={typeof (message as any).duration === 'number' ? (message as any).duration : undefined}
              />
            </>
          )}
          {/* Image message */}
          {message.imageUrl && (
            <>
              <div
                className={`relative max-w-xs rounded-2xl overflow-hidden shadow transition-all duration-200 cursor-pointer ${
                  isMine
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-surface)] rounded-br-md'
                    : 'bg-[var(--color-background)] border border-[var(--color-primary-light)]/20 text-[var(--color-primary-dark)] rounded-bl-md'
                }`}
                style={{ minWidth: '2.5rem' }}
                onClick={() => setShowImagePreview(true)}
              >
                {!imgLoaded && !imgError && (
                  <div className="flex items-center justify-center w-full h-40 bg-gray-100">
                    <span className="animate-spin w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full"></span>
                  </div>
                )}
                {imgError && (
                  <div className="flex items-center justify-center w-full h-40 bg-red-100 text-red-500">
                    Failed to load image
                  </div>
                )}
                <div className="relative px-1 pt-1 pb-5 bg-[var(--color-primary-light)]/10 rounded-2xl shadow-md border border-[var(--color-primary-light)]/20 overflow-hidden">
                  <Image
                    src={message.imageUrl}
                    alt="Sent image"
                    width={400}
                    height={300}
                    className={`max-w-xs w-full object-cover transition-opacity duration-300 rounded-xl ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                    style={{ display: imgError ? 'none' : undefined }}
                  />
                  {/* Read/Unread tick for image messages (isMine only) */}
                  {isMine && imgLoaded && (
                    <span className="absolute bottom-0 right-4">
                      {message.isRead ? (
                        <CheckCheck className="inline w-4 h-4 text-[var(--color-surface)]" />
                      ) : (
                        <Check className="inline w-4 h-4 text-[var(--color-surface)]" />
                      )}
                    </span>
                  )}
                </div>
              </div>
              {/* Image Preview Modal */}
              {showImagePreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowImagePreview(false)}>
                  <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                    <Image
                      src={message.imageUrl}
                      alt="Preview"
                      width={800}
                      height={600}
                      className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
                    />
                    <button
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
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
              className={`px-4 py-2 rounded-2xl max-w-full whitespace-pre-wrap break-words text-sm ${
                isMine
                  ? "bg-[var(--color-primary-light)] text-[var(--color-surface)] rounded-br-md"
                  : "bg-[var(--color-background)] border border-[var(--color-primary-light)]/20 text-[var(--color-primary-dark)] rounded-bl-md"
              }`}
              style={{ minWidth: "2.5rem" }}
            >
              {message.content}
              {/* WhatsApp-like ticks for isMine only */}
              {isMine && (
                <span className="ml-2 align-middle">
                  {message.isRead ? (
                    <CheckCheck className="inline w-4 h-4 text-[var(--color-surface)]" />
                  ) : (
                    <Check className="inline w-4 h-4 text-[var(--color-surface)]" />
                  )}
                </span>
              )}
            </div>
          )}
          {isMine && (
            <div className="relative">
              <button
                className="p-1 rounded-full hover:bg-[var(--color-primary-light)]/20 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setMenuOpen((open) => !open)}
                tabIndex={-1}
                aria-label="Message options"
                type="button"
              >
                <MoreVertical className="w-4 h-4 text-[var(--color-muted)]" />
              </button>
              {/* Menu dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-[var(--color-surface)] border border-[var(--color-primary-light)]/20 rounded shadow-lg min-w-[120px] z-20">
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
        {/* Timestamp and delete confirmation */}
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
      const isValid = url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'blob:';
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('Audio URL validation:', {
          audioUrl,
          protocol: url.protocol,
          isValid,
          hostname: url.hostname,
          pathname: url.pathname,
          isBlobUrl: url.protocol === 'blob:'
        });
        
        // Warn if using blob URL (temporary)
        if (url.protocol === 'blob:') {
          console.warn('Audio message using blob URL (temporary):', audioUrl);
        }
      }
      
      return isValid;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Audio URL validation error:', error, audioUrl);
      }
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
      
      // Get specific error message based on error code
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
      
      console.error('Audio playback error:', {
        error: error?.code,
        message: error?.message,
        errorMessage,
        audioUrl,
        readyState: target.readyState,
        networkState: target.networkState
      });
      
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
    const handleLoadError = () => {
      setIsLoading(false);
      setAudioError(true);
      setErrorMessage('Failed to load audio');
    };
    
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('loadedmetadata', setDur);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loaderror', handleLoadError);
    
    return () => {
      audio.removeEventListener('timeupdate', update);
      audio.removeEventListener('loadedmetadata', setDur);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loaderror', handleLoadError);
    };
  }, [audioUrl, isValidAudioUrl]);

  // Use messageDuration as fallback if metadata fails
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
        console.error('Playback error:', err);
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

  // If there's an audio error, show error state
  if (audioError) {
    const isBlobUrl = audioUrl?.startsWith('blob:');
    const errorText = isBlobUrl 
      ? 'Audio file not available (temporary link expired)' 
      : errorMessage || 'Audio playback failed';
    
    return (
      <div
        className={`flex items-center gap-3 px-4 py-2 whitespace-pre-wrap break-words text-sm rounded-2xl shadow transition-all duration-200 flex-1 ${
          isMine
            ? 'bg-[var(--color-danger, #ef4444)] text-[var(--color-surface)] rounded-br-md'
            : 'bg-[var(--color-danger-bg, #fef2f2)] border border-[var(--color-danger, #ef4444)]/20 text-[var(--color-danger, #ef4444)] rounded-bl-md'
        }`}
        style={{ minWidth: 220, maxWidth: 360 }}
      >
        <span className="text-xs">
          {!isValidAudioUrl ? 'Invalid audio URL' : errorText}
        </span>
        {isMine && (
          <span className="ml-2 align-middle">
            {isRead ? (
              <CheckCheck className="inline w-4 h-4 text-[var(--color-surface)]" />
            ) : (
              <Check className="inline w-4 h-4 text-[var(--color-surface)]" />
            )}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-5 whitespace-pre-wrap break-words text-sm rounded-2xl shadow transition-all duration-200 flex-1 ${
        isMine
          ? 'bg-[var(--color-primary-light)] text-[var(--color-surface)] rounded-br-md'
          : 'bg-[var(--color-background)] border border-[var(--color-primary-light)]/20 text-[var(--color-primary-dark)] rounded-bl-md'
      }`}
      style={{ minWidth: 220, maxWidth: 360 }}
    >
      {/* Play/Pause Button at start */}
      <button
        onClick={togglePlayback}
        disabled={isLoading}
        className={`focus:outline-none flex-shrink-0 hover:scale-110 transition-transform duration-150 ${
          isMine ? 'text-[var(--color-surface)]' : 'text-[var(--color-primary-light)]'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        type="button"
        style={{ fontSize: 22, lineHeight: 1 }}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>
      {/* Time in center */}
      <span className="text-xs font-mono min-w-[60px] text-center flex-1">
        {isLoading || !(duration > 0) ? (
          <span className="inline-block w-8 text-center">...</span>
        ) : isPlaying ? (
          `${formatTime(currentTime)} / ${formatTime(duration)}`
        ) : (
          formatTime(duration)
        )}
      </span>
      {/* Read/Unread tick at end for isMine only */}
      {isMine && (
        <span className="ml-2 align-middle flex-shrink-0">
          {isRead ? (
            <CheckCheck className="inline w-4 h-4 text-[var(--color-surface)]" />
          ) : (
            <Check className="inline w-4 h-4 text-[var(--color-surface)]" />
          )}
        </span>
      )}
      {/* Hidden audio element */}
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