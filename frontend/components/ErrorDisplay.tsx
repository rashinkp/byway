import React, { FC } from "react";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: unknown;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  title = "Something Went Wrong",
  description = "An error occurred while processing your request. Please try again.",
}) => {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "An unexpected error occurred";

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm p-8 w-full text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle size={48} className="text-red-500" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
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
      </div>
    </div>
  );
};

export default ErrorDisplay;
