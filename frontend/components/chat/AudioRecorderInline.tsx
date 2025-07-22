import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Square, Send, Trash2, Play, Pause } from 'lucide-react';
import { AlertComponent } from '@/components/ui/AlertComponent';
import { getPresignedUrl, uploadFileToS3 } from '@/api/file';

interface ModernAudioRecorderProps {
  onSend: (audioUrl: string, duration: number) => void;
  onCancel: () => void;
  maxDuration?: number;
}

export function ModernAudioRecorder({
  onSend,
  onCancel,
  maxDuration = 300,
}: ModernAudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getSupportedMimeType = () => {
    const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/wav'];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return 'audio/webm';
  };

  const checkBrowserSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Media devices not supported in this browser');
    }
    if (!window.MediaRecorder) {
      throw new Error('MediaRecorder not supported in this browser');
    }
    const mimeType = getSupportedMimeType();
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      throw new Error(`Audio format ${mimeType} not supported in this browser`);
    }
    return mimeType;
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setDuration(0);
    setIsPlaying(false);
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  };

  useEffect(() => {
    startRecording();
    return () => {
      cleanup();
    };
    // eslint-disable-next-line
  }, []);

  const startRecording = async () => {
    setError(null);
    setDuration(0);
    try {
      const mimeType = checkBrowserSupport();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
      });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length === 0) {
          setError('No audio data recorded. Please try again.');
          return;
        }
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size === 0) {
          setError('Recording failed. Please try again.');
          return;
        }
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }
      };

      mediaRecorder.onerror = () => {
        setError('Recording failed. Please try again.');
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    if (audioRef.current.readyState < 2) {
      setError('Audio not ready to play. Please try again.');
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        setError('Failed to play audio. Please try again.');
      });
      setIsPlaying(true);
    }
  };

  const handleSend = async () => {
    if (audioUrl && duration > 0) {
      try {
        setIsUploading(true);
        setError(null);
        const s3AudioUrl = await uploadToS3(audioUrl);
        onSend(s3AudioUrl, duration);
      } catch {
        setError('Failed to upload audio. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRequestDiscard = () => {
    setShowDiscardAlert(true);
  };

  const handleDiscard = () => {
    setShowDiscardAlert(false);
    cleanup();
    onCancel();
  };

  const uploadToS3 = async (audioUrl: string): Promise<string> => {
    const response = await fetch(audioUrl);
    const blob = await response.blob();
    let fileExtension = 'webm';
    const mimeType = blob.type;
    if (mimeType.includes('mp4') || mimeType.includes('m4a')) {
      fileExtension = 'm4a';
    } else if (mimeType.includes('ogg')) {
      fileExtension = 'ogg';
    } else if (mimeType.includes('wav')) {
      fileExtension = 'wav';
    } else if (mimeType.includes('mp3')) {
      fileExtension = 'mp3';
    }
    const audioFile = new File([blob], `audio-${Date.now()}.${fileExtension}`, { type: mimeType });
    const { uploadUrl, fileUrl } = await getPresignedUrl(audioFile.name, audioFile.type);
    await uploadFileToS3(audioFile, uploadUrl);
    return fileUrl;
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-300 text-sm mb-2">{error}</p>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#facc15]/10">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#facc15]/20 rounded-lg shadow-sm transition-colors duration-300">
      {/* Recording State */}
      {isRecording && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#facc15] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Recording... {formatTime(duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={stopRecording} size="sm" className="bg-[#facc15] hover:bg-[#facc15]/80 text-black">
              <Square className="w-4 h-4 mr-1" />
              Stop
            </Button>
            <Button onClick={handleRequestDiscard} variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#facc15]/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Playback State */}
      {audioUrl && !isRecording && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Button onClick={togglePlayback} size="sm" variant="ghost" className="p-2 text-[#facc15]">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Voice message ({formatTime(duration)})</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-3">
            <Button 
              onClick={handleSend} 
              size="sm" 
              className="bg-[#facc15] hover:bg-[#facc15]/80 text-black"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-1" />
                  Uploading...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  Send
                </>
              )}
            </Button>
            <Button onClick={handleRequestDiscard} variant="ghost" size="sm" disabled={isUploading} className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#facc15]/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setError('Failed to play audio. Please try recording again.')}
          preload="metadata"
          style={{ display: 'none' }}
        />
      )}
      
      {/* Discard confirmation */}
      {showDiscardAlert && (
        <AlertComponent
          open={showDiscardAlert}
          onOpenChange={setShowDiscardAlert}
          title="Discard recording?"
          description="Are you sure you want to discard this recording?"
          confirmText="Yes, Discard"
          cancelText="Cancel"
          onConfirm={handleDiscard}
        />
      )}
    </div>
  );
}