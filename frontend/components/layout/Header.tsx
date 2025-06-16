"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLogout } from "@/hooks/auth/useLogout";
import { useCreateInstructor } from "@/hooks/instructor/useCreateInstructor";
import { useGetInstructorByUserId } from "@/hooks/instructor/useGetInstructorByUserId";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Search,
  Heart,
  ShoppingCart,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  BookOpen,
  Clock,
  Star,
  Users,
  Tag,
} from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  InstructorFormModal,
  InstructorSubmitData,
} from "@/components/instructor/InstructorAdd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/category/useCategories";
import { useGlobalSearch } from "@/hooks/search/useGlobalSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";

interface HeaderProps {
  client?: { id: string; name: string };
}

export function Header({ client }: HeaderProps = {}) {
  const { user, isLoading } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: createInstructor, isPending: isCreatingInstructor } =
    useCreateInstructor();
  const { data: instructorData, isLoading: isInstructorLoading } =
    useGetInstructorByUserId(false);
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { data: searchResults, isLoading: isSearching } = useGlobalSearch({
    query: debouncedSearchQuery,
    page: 1,
    limit: 5,
  });
  
  // Refs for click outside handling
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleInstructorSubmit = useCallback(
    async (data: InstructorSubmitData): Promise<void> => {
      return new Promise((resolve) => {
        createInstructor(data, {
          onSuccess: () => {
            setIsInstructorModalOpen(false);
            resolve();
          },
          onError: () => {
            resolve();
          },
        });
      });
    },
    [createInstructor]
  );

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  }, []);

  // Show search results when query changes
  useEffect(() => {
    if (debouncedSearchQuery && searchResults) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [debouncedSearchQuery, searchResults]);

  // Handle search item click
  const handleSearchItemClick = () => {
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Check if instructor application is pending
  const isInstructorPending =
    instructorData?.data?.status === "PENDING" || isInstructorLoading;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "bg-white shadow-md" : "bg-white/95"
        )}
      >
        <div className="container mx-auto px-10 py-3">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-10">
              <Link
                href="/"
                className="text-2xl font-bold text-blue-600 flex items-center gap-2 hover:text-blue-700 transition-colors"
              >
                Byway
              </Link>
              <Link href="/categories">
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-600 hover:bg-gray-50 text-base font-medium"
                >
                  Categories
                </Button>
              </Link>
            </div>
            
            {/* Enhanced Search Bar */}
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
                                    {/* {course.rating && (
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                        <span className="text-xs text-gray-500">{course.rating}</span>
                                      </div>
                                    )} */}
                                  </div>
                                </div>
                                <Clock className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                              </Link>
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
                       searchResults.categories.items.length === 0 && (
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
            
            <nav className="flex items-center gap-4">
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              ) : user ? (
                <>
                  {user.role !== "INSTRUCTOR" && (
                    <Button
                      variant="ghost"
                      onClick={() => setIsInstructorModalOpen(true)}
                      disabled={isLoggingOut || isCreatingInstructor}
                      className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 text-base font-medium"
                    >
                      {isCreatingInstructor ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        "Teach on Byway"
                      )}
                    </Button>
                  )}
                  <div className="flex items-center gap-5">
                    {/* <div className="relative group">
                      <Heart
                        className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors cursor-pointer"
                        strokeWidth={1.5}
                      />
                    </div> */}
                    <div className="relative group">
                      <Link href="/user/cart">
                        <ShoppingCart
                          className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors cursor-pointer"
                          strokeWidth={1.5}
                        />
                      </Link>
                    </div>
                    <div className="relative group">
                      {/* <Bell
                        className="w-6 h-6 text-gray-600 group-hover:text-yellow-500 transition-colors cursor-pointer"
                        strokeWidth={1.5}
                      /> */}
                      {/* <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-yellow-500"
                      >
                        5
                      </Badge> */}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="relative group cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium border-2 border-blue-200 group-hover:border-blue-300 transition-all">
                            {user.name?.charAt(0) || "U"}
                          </div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="text-gray-800 font-semibold">
                          {user.name || "User"}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link
                            href="/user/profile"
                            className="flex items-center w-full"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href="/user/my-courses"
                            className="flex items-center w-full"
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            My Courses
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            logout();
                            router.push("/login");
                          }}
                          disabled={isLoggingOut}
                          className="text-gray-700 hover:text-red-600"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 text-base font-medium"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 text-base font-medium">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 flex items-center gap-2"
            >
              <BookOpen className="w-6 h-6" />
              Byway
            </Link>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <ShoppingCart
                  className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors cursor-pointer"
                  strokeWidth={1.5}
                />
                {user && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    2
                  </Badge>
                )}
              </div>
              {user && (
                <div className="relative group">
                  <Link href="/user/profile">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium border-2 border-blue-200 group-hover:border-blue-300 transition-all">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-2 space-y-4 border-t mt-3">
              <div className="relative" ref={searchContainerRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && searchResults && setShowSearchResults(true)}
                  placeholder="Search courses"
                  className="w-full py-2.5 px-4 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                )}
              </div>
              <div className="space-y-3">
                <Link
                  href="/categories"
                  className="block px-2 py-1 text-gray-700 hover:text-blue-600 font-medium text-base"
                >
                  Categories
                </Link>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <div className="flex justify-between items-center gap-2 mt-4">
                      <Skeleton className="h-10 w-1/2" />
                      <Skeleton className="h-10 w-1/2" />
                    </div>
                  </div>
                ) : user ? (
                  <>
                    <Link
                      href="/user/profile"
                      className="block px-2 py-1 text-gray-700 hover:text-blue-600 text-base"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/user/my-courses"
                      className="block px-2 py-1 text-gray-700 hover:text-blue-600 text-base"
                    >
                      My Courses
                    </Link>
                    {user.role !== "INSTRUCTOR" && (
                      <button
                        onClick={() => setIsInstructorModalOpen(true)}
                        disabled={isLoggingOut || isCreatingInstructor}
                        className="w-full text-left px-2 py-1 text-gray-700 hover:text-blue-600 text-base"
                      >
                        {isCreatingInstructor
                          ? "Applying..."
                          : "Teach on Byway"}
                      </button>
                    )}
                    <div className="flex justify-between items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => logout()}
                        disabled={isLoggingOut}
                        className="w-full border-gray-300 text-gray-700 rounded-lg text-base"
                      >
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center gap-2 mt-4">
                    <Link href="/login" className="w-1/2">
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 rounded-lg text-base"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" className="w-1/2">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      <InstructorFormModal
        open={isInstructorModalOpen}
        onOpenChange={setIsInstructorModalOpen}
        onSubmit={handleInstructorSubmit}
        isSubmitting={isCreatingInstructor}
      />
    </>
  );
}