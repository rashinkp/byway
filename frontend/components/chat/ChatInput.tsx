import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Image as ImageIcon, Mic } from 'lucide-react';
import { ModernAudioRecorder } from './AudioRecorderInline';
import { ModernImageUploader } from './ImageUploaderChat';

interface ModernChatInputProps {
  onSendMessage: (content: string, imageUrl?: string, audioUrl?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isNewChat?: boolean;
  setPendingImageUrl?: (url: string) => void;
  setPendingAudioUrl?: (url: string) => void;
}

type InputMode = 'text' | 'audio' | 'image';

export function ModernChatInput({ 
  onSendMessage, 
  placeholder = "Type a message...",
  disabled = false,
  isNewChat = false,
  setPendingImageUrl,
  setPendingAudioUrl,
}: ModernChatInputProps) {
  const [message, setMessage] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('text');

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleSendAudio = (audioUrl: string) => {
    if (isNewChat && setPendingAudioUrl) {
      setPendingAudioUrl(audioUrl);
      setInputMode('text');
    } else {
      onSendMessage('', undefined, audioUrl);
      setInputMode('text');
    }
  };

  const handleSendImage = (imageFile: File, imageUrl: string) => {
    if (isNewChat && setPendingImageUrl) {
      setPendingImageUrl(imageUrl);
      setInputMode('text');
    } else {
      onSendMessage('', imageUrl);
      setInputMode('text');
    }
  };

  const handleCancel = () => {
    setInputMode('text');
  };

  const renderInputContent = () => {
    switch (inputMode) {
      case 'audio':
        return (
          <div className="w-full">
            <ModernAudioRecorder
              onSend={handleSendAudio}
              onCancel={handleCancel}
              maxDuration={300}
            />
          </div>
        );
      
      case 'image':
        return (
          <div className="w-full">
            <ModernImageUploader
              onSend={handleSendImage}
              onCancel={handleCancel}
              maxSizeMB={5}
            />
          </div>
        );
      
      default:
        return (
          <form onSubmit={handleSendText} className="flex items-center gap-2 w-full">
            {/* Text Input */}
            <Input
              type="text"
              placeholder={placeholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={disabled}
              className="flex-1 border-[var(--color-primary-light)]/30 focus:border-[var(--color-primary-light)] focus:ring-1 focus:ring-[var(--color-primary-light)]"
            />

            {/* Media Buttons (moved to right) */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setInputMode('image')}
                disabled={disabled}
                className="p-2 h-9 w-9 hover:bg-[var(--color-primary-light)]/10"
                title="Add image"
              >
                <ImageIcon className="w-4 h-4 text-[var(--color-muted)]" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setInputMode('audio')}
                disabled={disabled}
                className="p-2 h-9 w-9 hover:bg-[var(--color-primary-light)]/10"
                title="Record audio"
              >
                <Mic className="w-4 h-4 text-[var(--color-muted)]" />
              </Button>
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              className="bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-dark)] disabled:bg-[var(--color-muted)] px-4 py-2 h-9 text-[var(--color-surface)]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        );
    }
  };

  return (
    <div className="flex-shrink-0 px-4 py-3 bg-[var(--color-surface)] border-t border-[var(--color-primary-light)]/20">
      {renderInputContent()}
    </div>
  );
}