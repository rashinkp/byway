import React, { FC, ReactNode, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: any;
  onRetry?: () => void;
  title?: string;
  description?: string;
  statusCode?: number | string;
  children?: ReactNode;
  compact?: boolean; // If true, render inline/compact version
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  title = "Something Went Wrong",
  description = "An error occurred while processing your request. Please try again.",
  statusCode,
  children,
  compact = false,
}) => {
  const errorMessage =
    error?.message ||
    (typeof error === "string" ? error : "An unexpected error occurred");
  const code = statusCode || error?.status || error?.statusCode;
  const errorRef = useRef<HTMLDivElement>(null);

  // Focus error for accessibility
  useEffect(() => {
    if (errorRef.current) {
      errorRef.current.focus();
    }
  }, []);

  if (compact) {
    return (
      <div
        ref={errorRef}
        tabIndex={-1}
        role="alert"
        className="inline-flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 text-sm"
        aria-live="assertive"
      >
        <AlertCircle className="w-4 h-4" aria-hidden="true" />
        <span>{title}</span>
        {code && <span className="ml-2 text-xs text-red-400">[{code}]</span>}
        <span className="ml-2">{errorMessage}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 underline text-blue-600 hover:text-blue-800"
            aria-label="Retry the action"
          >
            Retry
          </button>
        )}
        {children}
      </div>
    );
  }

  return (
    <div
      ref={errorRef}
      tabIndex={-1}
      role="alert"
      aria-live="assertive"
      className="container mx-auto max-w-2xl px-4 py-8 min-h-screen flex items-center justify-center"
    >
      <div className="bg-white rounded-lg shadow-sm p-8 w-full text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle size={48} className="text-red-500" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
        {code && <div className="text-sm text-red-400 mb-2">Error Code: {code}</div>}
        <p className="text-gray-600 mb-4">{description}</p>
        <p className="text-red-600 font-medium mb-6" role="alert">
          Error: {errorMessage}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            aria-label="Retry the action"
          >
            Retry
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default ErrorDisplay;
