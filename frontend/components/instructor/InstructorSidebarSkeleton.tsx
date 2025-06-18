export default function InstructorSidebarSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6 sticky top-6">
      <div className="space-y-6">
        {/* Admin Actions Skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
} 