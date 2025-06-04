"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";
import Link from "next/link";

export default function InstructorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 9;

  const { data, isLoading, error } = useGetAllInstructors({
    page,
    limit,
    search,
    sortBy: "createdAt",
    sortOrder: "desc",
    filterBy: "Approved",
    includeDeleted: false
  });

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Our Instructors</h1>
          <p className="text-gray-600 mt-1">Learn from industry experts</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-3 w-full mt-4" />
              <Skeleton className="h-3 w-2/3 mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.items.map((instructor) => (
              <Link
                key={instructor.id}
                href={`/instructors/${instructor.userId}`}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                    {instructor.user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {instructor.user.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {instructor.areaOfExpertise}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 text-sm line-clamp-2">
                  {instructor.about || "No bio available"}
                </p>
              </Link>
            ))}
          </div>

          {data && data.data.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={data.data.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
} 