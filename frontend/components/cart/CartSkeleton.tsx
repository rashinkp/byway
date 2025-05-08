export function CartItemSkeleton() {
  return (
    <div className="p-6 border-b flex items-start animate-pulse">
      <div className="w-32 h-20 bg-gray-200 rounded-md flex-shrink-0"></div>
      <div className="ml-5 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
        </div>
        <div className="mt-3 text-right">
          <div className="h-6 bg-gray-200 rounded w-16 ml-auto mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-12 ml-auto mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-10 ml-auto"></div>
        </div>
      </div>
    </div>
  );
}
