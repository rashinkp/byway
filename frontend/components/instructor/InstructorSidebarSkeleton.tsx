export default function InstructorSidebarSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-[#232326] border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-6 sticky top-8">
      <div className="space-y-8">
        {/* Admin Actions Skeleton */}
        <div className="space-y-4">
          <div className="h-5 w-24 bg-[#facc15]/40 rounded animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 w-full bg-[#facc15]/20 rounded animate-pulse" />
            <div className="h-10 w-full bg-[#facc15]/20 rounded animate-pulse" />
            <div className="h-10 w-full bg-[#facc15]/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
} 