import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Loader } from "./Loader";

interface GoogleAuthButtonProps {
  text: string;
  onClick: () => void;
  isSubmitting?: boolean;
}

export function GoogleAuthButton({ text, onClick, isSubmitting = false }: GoogleAuthButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={onClick}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader size={20} className="mr-2" />
          Authenticating...
        </>
      ) : (
        <>
          <FcGoogle className="h-5 w-5" />
          {text}
        </>
      )}
    </Button>
  );
}
