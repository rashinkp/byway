import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image as ImageIcon, Mic } from "lucide-react";
import { ModernAudioRecorder } from "./AudioRecorderInline";
import { ModernImageUploader } from "./ImageUploaderChat";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ModernChatInputProps {
  onSendMessage: (
    content: string,
    imageUrl?: string,
    audioUrl?: string
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  isNewChat?: boolean;
  setPendingImageUrl?: (url: string) => void;
  setPendingAudioUrl?: (url: string) => void;
}

export function ModernChatInput({
  onSendMessage,
  placeholder = "Type a message...",
  disabled = false,
  isNewChat = false,
  setPendingImageUrl,
  setPendingAudioUrl,
}: ModernChatInputProps) {
  const [message, setMessage] = useState("");
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleSendAudio = (audioUrl: string) => {
    if (isNewChat && setPendingAudioUrl) {
      setPendingAudioUrl(audioUrl);
    } else {
      onSendMessage("", undefined, audioUrl);
    }
    setAudioModalOpen(false);
  };

  const handleSendImage = (imageFile: File, imageUrl: string) => {
    if (isNewChat && setPendingImageUrl) {
      setPendingImageUrl(imageUrl);
    } else {
      onSendMessage("", imageUrl);
    }
    setImageModalOpen(false);
  };

  const handleCancelAudio = () => {
    setAudioModalOpen(false);
  };
  const handleCancelImage = () => {
    setImageModalOpen(false);
  };

  const renderInputContent = () => {
    return (
      <form
        onSubmit={handleSendText}
        className="flex items-center gap-2 w-full"
      >
        {/* Text Input */}
        <Input
          type="text"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-[#facc15]/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] rounded-lg transition-all duration-200"
        />
        {/* Media Buttons */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setImageModalOpen(true)}
          disabled={disabled}
          className="p-2 h-9 w-9 hover:bg-gray-200 dark:hover:bg-[#facc15]/10 text-gray-600 dark:text-gray-300"
          title="Add image"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setAudioModalOpen(true)}
          disabled={disabled}
          className="p-2 h-9 w-9 hover:bg-gray-200 dark:hover:bg-[#facc15]/10 text-gray-600 dark:text-gray-300"
          title="Record audio"
        >
          <Mic className="w-4 h-4" />
        </Button>
        {/* Send Button */}
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-[#facc15] hover:bg-[#facc15]/80 disabled:bg-gray-400 text-black px-4 py-2 h-9 rounded-lg transition-colors duration-200"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    );
  };

  return (
    <div className="flex-shrink-0 px-4 py-3 bg-white dark:bg-[#18181b] dark:border-white/10 transition-colors duration-300">
      {renderInputContent()}
      <Dialog open={audioModalOpen} onOpenChange={setAudioModalOpen}>
        <DialogContent className="border-none bg-white dark:bg-[#18181b] ">
          <DialogTitle>Record Audio</DialogTitle>
          <ModernAudioRecorder
            onSend={handleSendAudio}
            onCancel={handleCancelAudio}
            maxDuration={300}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="border-none bg-white dark:bg-[#18181b] ">
          <DialogTitle>Upload Image</DialogTitle>
          <ModernImageUploader
            onSend={handleSendImage}
            onCancel={handleCancelImage}
            maxSizeMB={5}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
