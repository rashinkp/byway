import React, { FC } from "react";

interface ErrorDisplayProps {
  error: { message: string };
  onRetry?: () => void;
  title?: string;
  description?: string;
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  title,
  description,
}) => {
  return (
    <div className="space-y-6">
      {(title || description) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            )}
            {description && <p className="text-gray-500 mt-1">{description}</p>}
          </div>
        </div>
      )}
      <div className="text-red-600">
        <p>Error: {error.message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
