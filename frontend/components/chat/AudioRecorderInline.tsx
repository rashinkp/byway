import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {  Square, Send, Trash2, Play, Pause } from "lucide-react";
import { AlertComponent } from "@/components/ui/AlertComponent";
import { getPresignedUrl, uploadFileToS3 } from "@/api/file";

interface ModernAudioRecorderProps {
	onSend: (audioUrl: string, duration: number) => void;
	onCancel: () => void;
	maxDuration?: number;
}

export function ModernAudioRecorder({
	onSend,
	onCancel,
}: ModernAudioRecorderProps) {
	const [isRecording, setIsRecording] = useState(false);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const [duration, setDuration] = useState(0); // Total duration
	const [isPlaying, setIsPlaying] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showDiscardAlert, setShowDiscardAlert] = useState(false);
	const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null); // For duration fix
	const [isUploading, setIsUploading] = useState(false); // Upload state

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const streamRef = useRef<MediaStream | null>(null);

	// Get supported MIME type
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
		return "audio/webm"; // fallback
	};

	// Check browser support
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
		if (pendingAudioUrl) {
			URL.revokeObjectURL(pendingAudioUrl);
			setPendingAudioUrl(null);
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
			// Check browser support first
			const mimeType = checkBrowserSupport();

			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					sampleRate: 44100,
				},
			});
			streamRef.current = stream;

			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: mimeType,
			});
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				if (audioChunksRef.current.length === 0) {
					setError("No audio data recorded. Please try again.");
					return;
				}

				const audioBlob = new Blob(audioChunksRef.current, {
					type: mimeType,
				});

				// Validate blob
				if (audioBlob.size === 0) {
					setError("Recording failed. Please try again.");
					return;
				}

				const url = URL.createObjectURL(audioBlob);
				setPendingAudioUrl(url);
				setAudioUrl(url);
				setIsRecording(false);
				if (streamRef.current) {
					streamRef.current.getTracks().forEach((track) => track.stop());
					streamRef.current = null;
				}
			};

			mediaRecorder.onerror = (event) => {
				console.error("MediaRecorder error:", event);
				setError("Recording failed. Please try again.");
				setIsRecording(false);
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (err: any) {
			console.error("Recording error:", err);
			if (err.name === "NotAllowedError") {
				setError(
					"Microphone access denied. Please allow microphone permissions and try again.",
				);
			} else if (err.name === "NotFoundError") {
				setError(
					"No microphone found. Please connect a microphone and try again.",
				);
			} else if (err.name === "NotSupportedError") {
				setError(
					"Audio recording is not supported in this browser. Please use a modern browser.",
				);
			} else {
				setError(
					err.message ||
						"Could not access microphone. Please check permissions.",
				);
			}
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
			const audio = new window.Audio();

			const handleLoadedMetadata = () => {
				if (!isNaN(audio.duration) && audio.duration > 0) {
					setDuration(Math.round(audio.duration));
				} else {
					console.warn("Invalid audio duration:", audio.duration);
					setDuration(0);
				}
				setPendingAudioUrl(null);
			};

			const handleError = (e: Event) => {
				console.error("Error loading audio metadata:", e);
				setDuration(0);
				setPendingAudioUrl(null);
				setError("Failed to process audio. Please try recording again.");
			};

			const handleAbort = () => {
				console.warn("Audio loading aborted");
				setDuration(0);
				setPendingAudioUrl(null);
			};

			audio.addEventListener("loadedmetadata", handleLoadedMetadata);
			audio.addEventListener("error", handleError);
			audio.addEventListener("abort", handleAbort);

			// Set a timeout to prevent hanging
			const timeout = setTimeout(() => {
				if (pendingAudioUrl) {
					console.warn("Audio metadata loading timeout");
					audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
					audio.removeEventListener("error", handleError);
					audio.removeEventListener("abort", handleAbort);
					setDuration(0);
					setPendingAudioUrl(null);
				}
			}, 10000); // 10 second timeout

			audio.src = pendingAudioUrl;

			return () => {
				clearTimeout(timeout);
				audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
				audio.removeEventListener("error", handleError);
				audio.removeEventListener("abort", handleAbort);
				audio.src = "";
			};
		}
		return undefined;
	}, [pendingAudioUrl]);

	const togglePlayback = () => {
		if (!audioRef.current || !audioUrl) {
			console.warn("Audio element or URL not available");
			return;
		}

		// Check if audio is ready to play
		if (audioRef.current.readyState < 2) {
			// HAVE_CURRENT_DATA
			console.warn("Audio not ready to play");
			setError("Audio not ready to play. Please try again.");
			return;
		}

		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			audioRef.current.currentTime = 0;
			audioRef.current.play().catch((err) => {
				console.error("Playback error:", err);
				setIsPlaying(false);
				if (err.name === "NotAllowedError") {
					setError(
						"Audio playback blocked. Please allow autoplay and try again.",
					);
				} else {
					setError("Failed to play audio. Please try again.");
				}
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
			} catch (error) {
				console.error("Error uploading audio:", error);
				setError("Failed to upload audio. Please try again.");
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

	// S3 upload function for audio files
	const uploadToS3 = async (audioUrl: string): Promise<string> => {
		try {
			// Convert blob URL to File object
			const response = await fetch(audioUrl);
			const blob = await response.blob();

			// Determine the correct file extension based on MIME type
			let fileExtension = "webm";
			const mimeType = blob.type;

			if (mimeType.includes("mp4") || mimeType.includes("m4a")) {
				fileExtension = "m4a";
			} else if (mimeType.includes("ogg")) {
				fileExtension = "ogg";
			} else if (mimeType.includes("wav")) {
				fileExtension = "wav";
			} else if (mimeType.includes("mp3")) {
				fileExtension = "mp3";
			}

			// Create a File object from the blob with proper extension
			const audioFile = new File(
				[blob],
				`audio-${Date.now()}.${fileExtension}`,
				{
					type: mimeType,
				},
			);

			console.log("[AudioRecorder] Uploading audio file:", {
				name: audioFile.name,
				type: audioFile.type,
				size: audioFile.size,
			});

			// Get presigned URL for S3 upload
			const { uploadUrl, fileUrl } = await getPresignedUrl(
				audioFile.name,
				audioFile.type,
			);

			// Upload to S3
			await uploadFileToS3(audioFile, uploadUrl);

			console.log("[AudioRecorder] Audio uploaded successfully:", fileUrl);
			return fileUrl;
		} catch (error) {
			console.error("Error in S3 upload:", error);
			throw new Error("Failed to upload audio to cloud storage");
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	if (error) {
		return (
			<div className="flex items-center justify-center p-4 bg-[var(--color-danger-bg,#fef2f2)] border border-[var(--color-danger,#ef4444)]/20 rounded-lg">
				<div className="text-center">
					<p className="text-[var(--color-danger,#ef4444)] text-sm mb-2">
						{error}
					</p>
					<Button variant="outline" size="sm" onClick={onCancel}>
						Close
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3 p-4 bg-[var(--color-surface)] border border-[var(--color-primary-light)]/20 rounded-lg shadow-sm">
			{/* Recording State */}
			{isRecording && (
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-[var(--color-danger,#ef4444)] rounded-full animate-pulse" />
							<span className="text-sm font-medium text-[var(--color-primary-dark)]">
								Recording...
							</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button
							onClick={stopRecording}
							size="sm"
							className="bg-[var(--color-danger,#ef4444)] hover:bg-[var(--color-danger,#ef4444)]/80 text-[var(--color-surface)]"
						>
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
						<Button
							onClick={togglePlayback}
							size="sm"
							variant="outline"
							className="p-2 text-[var(--color-primary-light)]"
						>
							{isPlaying ? (
								<Pause className="w-4 h-4" />
							) : (
								<Play className="w-4 h-4" />
							)}
						</Button>
						<div className="flex-1">
							<div className="flex items-center justify-between text-sm">
								<span className="text-[var(--color-muted)]">Voice message</span>
								<span className="text-[var(--color-muted)] font-mono">
									{formatTime(duration)}
								</span>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2 ml-3">
						<Button
							onClick={handleSend}
							size="sm"
							className="bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-dark)] text-[var(--color-surface)]"
							disabled={isUploading}
						>
							{isUploading ? (
								<>
									<div className="w-4 h-4 border-2 border-[var(--color-surface)] border-t-transparent rounded-full animate-spin mr-1" />
									Uploading...
								</>
							) : (
								<>
									<Send className="w-4 h-4 mr-1" />
									Send
								</>
							)}
						</Button>
						<Button
							onClick={handleRequestDiscard}
							variant="outline"
							size="sm"
							disabled={isUploading}
						>
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
					onError={(e) => {
						console.error("Audio playback error:", e);
						setError("Failed to play audio. Please try recording again.");
					}}
					onLoadStart={() => {
						console.log("Audio loading started");
					}}
					onCanPlay={() => {
						console.log("Audio can play");
					}}
					preload="metadata"
					style={{ display: "none" }}
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
