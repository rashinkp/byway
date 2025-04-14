"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

interface GoogleAuthButtonProps {
  text: string;
  onClick: () => void;
}

export function GoogleAuthButton({ text, onClick }: GoogleAuthButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 py-5 border-border mb-6"
      onClick={onClick}
    >
      <FcGoogle className="h-5 w-5" />
      <span>{text}</span>
    </Button>
  );
}