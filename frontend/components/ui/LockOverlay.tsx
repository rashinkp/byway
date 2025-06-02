import { Lock } from "lucide-react";

interface LockOverlayProps {
  message?: string;
}

export function LockOverlay({ message = "Complete previous lessons to unlock" }: LockOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="bg-white/10 p-6 rounded-lg flex flex-col items-center gap-4">
        <Lock className="w-12 h-12 text-white" />
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  );
} 