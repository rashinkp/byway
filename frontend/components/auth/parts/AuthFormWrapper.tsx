import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import ErrorDisplay from "@/components/ErrorDisplay";

interface AuthFormWrapperProps {
  title: string;
  subtitle: string;
  error?: string | null;
  children: ReactNode;
  noCard?: boolean;
}

export function AuthFormWrapper({
  title,
  subtitle,
  error,
  children,
  noCard = false,
}: AuthFormWrapperProps) {
  const content = (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-muted-foreground text-sm md:text-base">{subtitle}</p>
        )}
      </div>
      {error && (
        <div className="flex justify-center mb-6">
          <ErrorDisplay 
            error={error} 
            title="Authentication Error" 
            description="There was a problem with your authentication. Please try again." 
            compact 
          />
        </div>
      )}
      {children}
    </>
  );

  if (noCard) {
    return <div className="w-full max-w-lg px-4">{content}</div>;
  }

  return (
    <Card className="shadow-none border-0 bg-card max-w-lg w-full mx-auto px-4">
      <CardContent className="p-0">{content}</CardContent>
    </Card>
  );
}