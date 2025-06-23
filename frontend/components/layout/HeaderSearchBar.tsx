import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2, User, BookOpen, Clock, Users, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGlobalSearch } from "@/hooks/search/useGlobalSearch";
import { useDebounce } from "@/hooks/useDebounce";

interface HeaderSearchBarProps {
  user: any;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showSearchResults: boolean;
  setShowSearchResults: (v: boolean) => void;
  handleSearchItemClick: () => void;
}

export const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({
  user,
  searchQuery,
  setSearchQuery,
  showSearchResults,
  setShowSearchResults,
  handleSearchItemClick,
}) => {
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
   const { data: searchResults, isLoading: isSearching } = useGlobalSearch({
    query: debouncedSearchQuery,
    page: 1,
    limit: 5,
  });
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowSearchResults]);

  // Show search results when query changes
  useEffect(() => {
    if (debouncedSearchQuery && searchResults) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [debouncedSearchQuery, searchResults, setShowSearchResults]);

  return (
    <div className="flex-1 max-w-md mx-8" ref={searchContainerRef}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && searchResults && setShowSearchResults(true)}
          placeholder="Search for courses, topics, instructors..."
          className="w-full py-2.5 px-4 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300 shadow-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}
        {/* Enhanced Search Results Dropdown */}
        {showSearchResults && searchResults && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden z-50">
            <div className="max-h-96 overflow-y-auto">
              {/* Instructors Section */}
              {searchResults.instructors.items.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-800">Instructors</h3>
                    <Badge variant="secondary" className="text-xs">
                      {searchResults.instructors.items.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {searchResults.instructors.items.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.id}`}
                        onClick={handleSearchItemClick}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                          {instructor.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {instructor.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {instructor.shortBio || "Instructor"}
                          </p>
                        </div>
                        <Users className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {/* Courses Section */}
              {searchResults.courses.items.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <h3 className="text-sm font-semibold text-gray-800">Courses</h3>
                    <Badge variant="secondary" className="text-xs">
                      {searchResults.courses.items.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {searchResults.courses.items.map((course) => (
                      <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        onClick={handleSearchItemClick}
                        className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors group"
                      >
                        <div className="w-12 h-8 rounded-md bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                          {course.thumbnail ? (
                            <img 
                              src={course.thumbnail} 
                              alt={course.title} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <BookOpen className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors truncate">
                            {course.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {course.offer ? (
                              <>
                                <span className="text-sm font-semibold text-green-600">
                                  ${course.offer}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  ${course.price}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-semibold text-green-600">
                                ${course.price}
                              </span>
                            )}
                          </div>
                        </div>
                        <Clock className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {/* Certificates Section */}
              {searchResults.certificates && searchResults.certificates.items.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-800">Certificates</h3>
                    <Badge variant="secondary" className="text-xs">
                      {searchResults.certificates.items.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {searchResults.certificates.items.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {cert.courseTitle}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            Certificate #: {cert.certificateNumber}
                          </p>
                          <p className="text-xs text-gray-400">
                            Issued: {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "-"}
                          </p>
                        </div>
                        {cert.pdfUrl && (
                          <a
                            href={cert.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
                            onClick={handleSearchItemClick}
                          >
                            Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Categories Section */}
              {searchResults.categories.items.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-gray-800">Categories</h3>
                    <Badge variant="secondary" className="text-xs">
                      {searchResults.categories.items.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {searchResults.categories.items.map((category) => (
                      <Link
                        key={category.id}
                        href={`/courses?category=${category.id}`}
                        onClick={handleSearchItemClick}
                        className="block p-3 hover:bg-purple-50 rounded-lg transition-colors group"
                      >
                        <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                          {category.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {/* No Results */}
              {searchResults.instructors.items.length === 0 && 
               searchResults.courses.items.length === 0 && 
               searchResults.categories.items.length === 0 &&
               (!searchResults.certificates || searchResults.certificates.items.length === 0) && (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try different keywords or browse categories</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 