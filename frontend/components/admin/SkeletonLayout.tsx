import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Skeleton */}
      <aside className="hidden lg:block w-64 bg-white shadow-md">
        <div className="p-4">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button Skeleton */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        {/* TopNavbar Skeleton (Breadcrumbs) */}
        <header className="bg-white shadow-sm p-4">
          <Skeleton className="h-6 w-1/2" />
        </header>

        {/* Content Skeleton */}
        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-12 w-1/2 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </main>
    </div>
  );
}