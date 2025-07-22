import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Square, Send, Trash2, Play, Pause, Mic, MicOff } from "lucide-react";

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
  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "recorded"
  >("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const getSupportedMimeType = () => {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
      "audio/wav",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "audio/webm";
  };

  const checkBrowserSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Media devices not supported in this browser");
    }
    if (!window.MediaRecorder) {
      throw new Error("MediaRecorder not supported in this browser");
    }
    const mimeType = getSupportedMimeType();
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      throw new Error(`Audio format ${mimeType} not supported in this browser`);
    }
    return mimeType;
  };

  const cleanup = () => {
    // Stop all timers and intervals
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Cleanup audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    // Disconnect analyser
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    // Reset states
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setRecordingState("idle");
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (recordingState !== "recording") return;

      analyser.getByteTimeDomainData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#facc15");
      gradient.addColorStop(1, "#f59e0b");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);
  };

  const startRecording = async () => {
    setError(null);
    setDuration(0);
    setCurrentTime(0);
    setRecordingState("recording");

    try {
      const mimeType = checkBrowserSupport();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      streamRef.current = stream;

      // Set up Web Audio API for waveform
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 2048;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Clear the timer when recording stops
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }

        if (audioChunksRef.current.length === 0) {
          setError("No audio data recorded. Please try again.");
          setRecordingState("idle");
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size === 0) {
          setError("Recording failed. Please try again.");
          setRecordingState("idle");
          return;
        }

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordingState("recorded");

        // Stop media stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        // Stop waveform animation
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        // Disconnect analyser
        if (analyserRef.current) {
          analyserRef.current.disconnect();
          analyserRef.current = null;
        }
      };

      mediaRecorder.onerror = () => {
        setError("Recording failed. Please try again.");
        setRecordingState("idle");
        cleanup();
      };

      mediaRecorder.start();

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);

      drawWaveform();
    } catch (err: any) {
      setError(
        err.message || "Could not access microphone. Please check permissions."
      );
      setRecordingState("idle");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (audioRef.current.readyState < 2) {
      setError("Audio not ready to play. Please try again.");
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        setError("Failed to play audio. Please try again.");
      });
    }
  };

  const handleSend = async () => {
    if (audioUrl && duration > 0) {
      try {
        setIsUploading(true);
        setError(null);
        // Simulate upload - replace with your actual upload logic
        const s3AudioUrl = await uploadToS3(audioUrl);
        onSend(s3AudioUrl, duration);
      } catch {
        setError("Failed to upload audio. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDiscard = () => {
    cleanup();
    onCancel();
  };

  // Simulated upload function - replace with your actual implementation
  const uploadToS3 = async (audioUrl: string): Promise<string> => {
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return audioUrl; // In reality, return the S3 URL
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Setup audio event listeners
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <MicOff className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Recording Error
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => {
              setError(null);
              startRecording();
            }}
            size="sm"
            className="bg-amber-400 hover:bg-amber-500 text-black font-medium"
          >
            Try Again
          </Button>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              recordingState === "recording"
                ? "bg-amber-100 dark:bg-amber-900/30"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <Mic
              className={`w-5 h-5 transition-colors duration-300 ${
                recordingState === "recording"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Voice Message
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {recordingState === "idle" && "Ready to record"}
              {recordingState === "recording" && "Recording in progress..."}
              {recordingState === "recorded" && "Recording complete"}
            </p>
          </div>
        </div>
        <Button
          onClick={handleDiscard}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Idle State */}
      {recordingState === "idle" && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Button
            onClick={startRecording}
            size="lg"
            className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-500 text-black shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Mic className="w-6 h-6" />
          </Button>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Click to start recording
            <br />
            <span className="text-xs">
              Max duration: {formatTime(maxDuration)}
            </span>
          </p>
        </div>
      )}

      {/* Recording State */}
      {recordingState === "recording" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-lg font-mono text-gray-900 dark:text-white">
              {formatTime(duration)}
            </span>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <canvas
              ref={canvasRef}
              className="w-full h-16 rounded-lg"
              width="400"
              height="64"
            />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={stopRecording}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-8"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          </div>
        </div>
      )}

      {/* Recorded State */}
      {recordingState === "recorded" && audioUrl && (
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={togglePlayback}
                size="sm"
                variant="ghost"
                className="w-10 h-10 rounded-full text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                disabled={isUploading}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              <div className="flex-1">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Voice message</span>
                  <span>
                    {isPlaying ? formatTime(currentTime) : formatTime(duration)}
                  </span>
                </div>
                <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="absolute h-2 bg-amber-400 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        duration > 0 ? (currentTime / duration) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={() => {
                cleanup();
                startRecording();
              }}
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              disabled={isUploading}
            >
              Re-record
            </Button>
            <Button
              onClick={handleSend}
              size="sm"
              className="bg-amber-400 hover:bg-amber-500 text-black font-medium px-6"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          style={{ display: "none" }}
        />
      )}
    </div>
  );
}
