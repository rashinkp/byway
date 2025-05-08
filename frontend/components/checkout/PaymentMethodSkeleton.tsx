export default function PaymentMethodSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="bg-gray-200 h-16 rounded-md mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center p-4 border rounded-md">
            <div className="w-5 h-5 bg-gray-200 rounded-full mr-3"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
        <div className="h-10 bg-gray-200 rounded-md w-full"></div>
      </div>
      <div className="flex justify-end">
        <div className="h-10 bg-gray-200 rounded-md w-40"></div>
      </div>
    </div>
  );
}
