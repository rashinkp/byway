import React from "react";

export const OrderSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
    <div className="flex gap-4">
      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
); 