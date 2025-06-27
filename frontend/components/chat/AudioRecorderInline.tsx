import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Send, Trash2, Play, Pause } from 'lucide-react';
import { AlertComponent } from '@/components/ui/AlertComponent';

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
  const [duration, setDuration] = useState(0); // Total duration
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null); // For duration fix

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up all resources
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
  };

  // Start recording immediately on mount
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
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus',
        });
        const url = URL.createObjectURL(audioBlob);
        setPendingAudioUrl(url);
        setAudioUrl(url);
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Could not access microphone. Please check permissions.');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Set accurate duration after recording stops
  useEffect(() => {
    if (pendingAudioUrl) {
      const audio = new window.Audio(pendingAudioUrl);
      audio.onloadedmetadata = () => {
        setDuration(Math.round(audio.duration));
        setPendingAudioUrl(null);
      };
      return () => {
        audio.src = '';
      };
    }
    return undefined;
  }, [pendingAudioUrl]);

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.error('Playback error:', err);
        setError('Failed to play audio.');
      });
      setIsPlaying(true);
    }
  };

  const handleSend = async () => {
    if (audioUrl && duration > 0) {
      const s3AudioUrl = await uploadToS3(audioUrl);
      onSend(s3AudioUrl, duration);
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

  // Mock S3 upload function (replace with actual S3 upload logic)
  const uploadToS3 = async (audioUrl: string): Promise<string> => {
    const response = await fetch(audioUrl);
    const blob = await response.blob();
    // Implement S3 upload logic here (e.g., using AWS SDK or presigned URL)
    // Return the S3 URL
    return 'https://my-bucket.s3.amazonaws.com/audio/example.webm';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 text-sm mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Recording State */}
      {isRecording && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Recording...</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={stopRecording} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
              <Square className="w-4 h-4 mr-1" />
              Stop
            </Button>
            <Button onClick={handleRequestDiscard} variant="outline" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Playback State */}
      {audioUrl && !isRecording && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Button onClick={togglePlayback} size="sm" variant="outline" className="p-2">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Voice message</span>
                <span className="text-gray-500 font-mono">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-3">
            <Button onClick={handleSend} size="sm" className="bg-green-500 hover:bg-green-600 text-white">
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
            <Button onClick={handleRequestDiscard} variant="outline" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
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