export default function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-4">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex items-start border-b pb-4">
            <div className="w-20 h-20 bg-gray-200 rounded-md mr-4"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <div className="h-10 bg-gray-200 rounded-md w-40"></div>
      </div>
    </div>
  );
}
