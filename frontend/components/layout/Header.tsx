"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLogout } from "@/hooks/auth/useLogout";
import { useCreateInstructor } from "@/hooks/instructor/useCreateInstructor";
import { Button } from "@/components/ui/button";
import {
	ShoppingCart,
	Bell,
	Menu,
	X,
	MessageSquare,
	ChevronDown,
	Loader2,
	Search,
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
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { useGlobalSearch } from "@/hooks/search/useGlobalSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";
import { HeaderSearchBar } from "@/components/layout/HeaderSearchBar";
import { useCartStore } from "@/stores/cart.store";
import { useChatStore } from "@/stores/chat.store";
import { useUnreadMessageCount } from "@/hooks/chat/useUnreadMessageCount";
import Image from 'next/image';

interface HeaderProps {
	client?: { id: string; name: string };
	onNotificationClick?: () => void;
	transparent?: boolean;
}

export function Header(
	{ onNotificationClick, transparent }: HeaderProps = {} as HeaderProps,
) {
	const { user, isLoading } = useAuth();
	const { mutate: logout, isPending: isLoggingOut } = useLogout();
	const { mutate: createInstructor, isPending: isCreatingInstructor } =
		useCreateInstructor();
	const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [showSearchResults, setShowSearchResults] = useState(false);
	const router = useRouter();
	const debouncedSearchQuery = useDebounce(searchQuery, 500);
	const { data: searchResults } = useGlobalSearch({
		query: debouncedSearchQuery,
		page: 1,
		limit: 5,
	});

	const [searchModalOpen, setSearchModalOpen] = useState(false);
	const [mobileSearchQuery, setMobileSearchQuery] = useState("");
	const [showMobileSearchResults, setShowMobileSearchResults] = useState(false);
	const mobileSearchInputRef = useRef<HTMLInputElement>(null);
	const debouncedMobileSearchQuery = useDebounce(mobileSearchQuery, 500);
	const { data: mobileSearchResults } = useGlobalSearch({
		query: debouncedMobileSearchQuery,
		page: 1,
		limit: 5,
	});

	// Refs for click outside handling
	const searchContainerRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const cartCount = useCartStore((state) => state.count);
	const setCartCount = useCartStore((state) => state.setCount);
	const unreadCount = useChatStore((state) => state.unreadCount);
	useUnreadMessageCount();


	console.log("Header rendered with user:", unreadCount);

	// Sync initial cart count from user data
	useEffect(() => {
		if (user && typeof user.cartCount === "number") {
			setCartCount(user.cartCount);
		}
	}, [user, setCartCount]);

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
		[createInstructor],
	);

	// Handle navigation with dropdown close
	const handleNavigation = useCallback(
		(path: string) => {
			setIsDropdownOpen(false);

			// Map old paths to new profile section paths
			const pathMap: { [key: string]: string } = {
				"/user/my-courses": "/user/profile?section=courses",
				"/user/wallet": "/user/profile?section=wallet",
				"/user/transactions": "/user/profile?section=transactions",
				"/user/my-orders": "/user/profile?section=orders",
				"/user/profile": "/user/profile",
			};

			const newPath = pathMap[path] || path;
			router.push(newPath);
		},
		[router],
	);

	// Handle logout with dropdown close
	const handleLogout = useCallback(() => {
		setIsDropdownOpen(false);
		logout(undefined, {
			onSuccess: () => {
				router.push("/login");
			},
			onError: (error) => {
				console.error("Logout failed:", error);
				// Even if logout fails, redirect to login page
				router.push("/login");
			},
		});
	}, [logout, router]);

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
			if (
				searchContainerRef.current &&
				!searchContainerRef.current.contains(event.target as Node)
			) {
				setShowSearchResults(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
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

	useEffect(() => {
		const handler = () => {
			if (searchInputRef.current) {
				searchInputRef.current.focus();
			}
		};
		window.addEventListener("focus-header-search-bar", handler);
		return () => window.removeEventListener("focus-header-search-bar", handler);
	}, []);

	// Autofocus input when modal opens
	useEffect(() => {
		if (searchModalOpen && mobileSearchInputRef.current) {
			mobileSearchInputRef.current.focus();
		}
	}, [searchModalOpen]);

	// Show/hide results
	useEffect(() => {
		if (debouncedMobileSearchQuery && mobileSearchResults) {
			setShowMobileSearchResults(true);
		} else {
			setShowMobileSearchResults(false);
		}
	}, [debouncedMobileSearchQuery, mobileSearchResults]);

	const handleMobileSearchItemClick = () => {
		setShowMobileSearchResults(false);
		setMobileSearchQuery("");
		setSearchModalOpen(false);
	};

	return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 ",
          transparent
            ? "bg-transparent shadow-none"
            : scrolled
            ? "bg-white dark:bg-neutral-900 shadow-md"
            : "bg-white dark:bg-neutral-900"
        )}
      >
        <div className="container mx-auto px-10 py-3">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-10">
              <Link
                href="/"
                className="text-2xl font-bold text-black dark:text-white flex items-center gap-2 transition-colors hover:text-[#facc15] dark:hover:text-[#facc15]"
              >
                Byway
              </Link>
            </div>
            {/* Modularized Search Bar */}
            <HeaderSearchBar
              user={user}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showSearchResults={showSearchResults}
              setShowSearchResults={setShowSearchResults}
              handleSearchItemClick={handleSearchItemClick}
              inputRef={searchInputRef}
            />
            {/* Courses and Pages links moved next to icons */}
            <nav className="flex items-center gap-4">
              <Link
                href="/courses"
                className="text-base font-medium text-black dark:text-white px-2 py-1 rounded transition-colors hover:text-[#facc15] dark:hover:text-[#facc15]"
              >
                Courses
              </Link>
              {/* Pages dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="link"
                    className="flex items-center gap-1 text-base font-medium text-black dark:text-white px-2 py-1 rounded focus:outline-none shadow-none border-none bg-transparent hover:text-[#facc15] dark:hover:text-[#facc15] group"
                  >
                    Pages
                    <ChevronDown className="w-4 h-4 transition-colors text-black dark:text-white group-hover:text-[#facc15] dark:group-hover:text-[#facc15]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-40 bg-white dark:bg-neutral-800 text-black dark:text-white shadow-lg border-0 p-1"
                >
                  <DropdownMenuItem
                    asChild
                    className="rounded hover:bg-[#facc15] hover:text-black dark:hover:bg-[#facc15] dark:hover:text-[#18181b] dark:hover:bg-opacity-80"
                  >
                    <Link href="/categories">Categories</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded hover:bg-[#facc15] hover:text-black dark:hover:bg-[#facc15] dark:hover:text-[#18181b]"
                  >
                    <Link href="/instructors">Instructors</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded hover:bg-[#facc15] hover:text-black dark:hover:bg-[#facc15] dark:hover:text-[#18181b]"
                  >
                    <Link href="/theme">Theme</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {isLoading ? (
                <div className="flex items-center justify-center w-20 h-10">
                  <Loader2 className="w-6 h-6 text-[#facc15] animate-spin" />
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      <Link href="/chat">
                        <MessageSquare
                          className="w-6 h-6 text-black dark:text-white group-hover:text-[#facc15] dark:group-hover:text-[#facc15] transition-colors cursor-pointer"
                          strokeWidth={1.5}
                        />
                        {unreadCount > 0 && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs rounded-full bg-[#facc15] text-black font-bold shadow ">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    </div>
                    <div className="relative group">
                      <Link href="/user/cart">
                        <ShoppingCart
                          className="w-6 h-6 text-black dark:text-white group-hover:text-[#facc15] dark:group-hover:text-[#facc15] transition-colors cursor-pointer"
                          strokeWidth={1.5}
                        />
                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs rounded-full bg-[#facc15] text-black font-bold shadow ">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </div>
                    <div className="relative group">
                      <Bell
                        className="w-6 h-6 text-black dark:text-white group-hover:text-[#facc15] dark:group-hover:text-[#facc15] transition-colors cursor-pointer"
                        strokeWidth={1.5}
                        onClick={onNotificationClick}
                      />
                    </div>
                    <DropdownMenu
                      open={isDropdownOpen}
                      onOpenChange={setIsDropdownOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <div className="relative group cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-[#facc15] dark:bg-[#232323] flex items-center justify-center text-black dark:text-[#facc15] font-bold  transition-all border border-[#facc15] dark:border-[#facc15]">
                            {user.name?.charAt(0) || "U"}
                          </div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 bg-white dark:bg-[#232323] text-black dark:text-white shadow-lg border-0 p-1"
                      >
                        <DropdownMenuLabel className="text-black dark:text-white font-semibold">
                          {user.name || "User"}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleNavigation("/user/profile")}
                          className="rounded"
                        >
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleNavigation("/user/my-courses")}
                          className="rounded"
                        >
                          My Courses
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setIsInstructorModalOpen(true)}
                          className="rounded"
                        >
                          Teach on Byway
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="rounded"
                        >
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="bg-[#facc15] text-black hover:bg-black hover:text-[#facc15] border-none dark:bg-neutral-800 dark:text-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black">
                      Sign In
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
              className="text-black  bg-transparent border-none"
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
              className="text-2xl font-bold text-black dark:text-white flex items-center gap-2 hover:text-[#facc15] transition-colors"
            >
              Byway
            </Link>
            <div className="flex items-center gap-3">
              {/* Mobile Search Icon Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-black dark:text-white bg-transparent border-none"
                onClick={() => setSearchModalOpen(true)}
              >
                <Search className="h-6 w-6" />
              </Button>
              {user ? (
                <>
                  <div className="relative group">
                    <Link href="/chat">
                      <MessageSquare
                        className="w-6 h-6 text-black dark:text-white group-hover:text-[#facc15] dark:group-hover:text-[#facc15] transition-colors cursor-pointer"
                        strokeWidth={1.5}
                      />
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs rounded-full bg-[#facc15] text-black font-bold shadow ">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </div>
                  <div className="relative group">
                    <Link href="/user/cart">
                      <ShoppingCart
                        className="w-6 h-6 text-black dark:text-white group-hover:text-[#facc15] dark:group-hover:text-[#facc15] transition-colors cursor-pointer"
                        strokeWidth={1.5}
                      />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs rounded-full bg-[#facc15] text-black font-bold shadow ">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </div>
                  <div className="relative group">
                    <Bell
                      className="w-6 h-6 text-black dark:text-white group-hover:text-[#facc15] dark:group-hover:text-[#facc15] transition-colors cursor-pointer"
                      strokeWidth={1.5}
                      onClick={onNotificationClick}
                    />
                  </div>
                  <div className="relative group">
                    <Link href="/user/profile">
                      <div className="w-9 h-9 rounded-full bg-[#facc15] flex items-center justify-center text-black font-bold  transition-all">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="bg-[#facc15] text-black hover:bg-black hover:text-[#facc15] border-none dark:bg-neutral-800 dark:text-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-2 space-y-4 border-t mt-3 bg-white dark:bg-neutral-900">
              <div className="space-y-3">
                <Link
                  href="/courses"
                  className="block px-2 py-1 text-black dark:text-white font-medium text-base rounded transition-colors hover:bg-[#facc15] dark:hover:text-black  "
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  href="/categories"
                  className="block px-2 py-1 text-black dark:text-white font-medium text-base rounded hover:bg-[#facc15]/50 dark:hover:bg-[#facc15] hover:text-black  transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  href="/instructors"
                  className="block px-2 py-1 text-black dark:text-white font-medium text-base rounded hover:bg-[#facc15]/50 dark:hover:bg-[#facc15] hover:text-black  transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Instructors
                </Link>
                <Link
                  href="/theme"
                  className="block px-2 py-1 text-black dark:text-white font-medium text-base rounded hover:bg-[#facc15]/50 dark:hover:bg-[#facc15] hover:text-black  transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Theme
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
                ) : (
                  user && (
                    <>
                      <Link
                        href="/user/profile"
                        className="block px-2 py-1 text-black dark:text-white font-medium text-base rounded hover:bg-[#facc15]/20 dark:hover:bg-[#facc15] hover:text-black  transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/user/profile?section=courses"
                        className="block px-2 py-1 text-black dark:text-white font-medium text-base rounded hover:bg-[#facc15]/20 dark:hover:bg-[#facc15] hover:text-black  transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Courses
                      </Link>
                      <div className="flex justify-between items-center gap-2 mt-4">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            logout(undefined, {
                              onSuccess: () => {
                                setIsMenuOpen(false);
                                router.push("/login");
                              },
                              onError: (error) => {
                                console.error("Logout failed:", error);
                                setIsMenuOpen(false);
                                // Even if logout fails, redirect to login page
                                router.push("/login");
                              },
                            });
                          }}
                          disabled={isLoggingOut}
                          className="w-full border-[#facc15] text-black rounded-lg text-base hover:bg-[#facc15]/20 transition-colors"
                        >
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </Button>
                      </div>
                    </>
                  )
                )}
                {!user && !isLoading && (
                  <Link href="/login">
                    <Button className="bg-[#facc15] text-black hover:bg-black hover:text-[#facc15] border-none w-full dark:bg-neutral-800 dark:text-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black">
                      Sign In
                    </Button>
                  </Link>
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
      {/* Mobile Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-full max-w-md  rounded-lg shadow-lg h-[85vh] p-4 flex flex-col mx-2">
            {/* Top bar: search icon, input, close button */}
            <div className="flex items-center gap-2 mb-4 bg-white dark:bg-[#18181b] rounded-md px-2 py-1">
              <Search className="w-5 h-5 text-black/60 dark:text-white/60" />
              <input
                type="text"
                value={mobileSearchQuery}
                onChange={e => setMobileSearchQuery(e.target.value)}
                placeholder="Search for courses, topics, instructors..."
                className="flex-1 py-2 px-2  bg-white dark:bg-[#18181b] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all duration-300 shadow-none"
                ref={mobileSearchInputRef}
              />
              <button
                className="text-2xl font-bold text-gray-700 dark:hover:text-[#facc15] dark:text-gray-200 hover:text-black focus:outline-none px-2"
                onClick={() => setSearchModalOpen(false)}
                aria-label="Close search"
                type="button"
              >
                ×
              </button>
            </div>
            {/* Results */}
            {showMobileSearchResults && mobileSearchResults && mobileSearchQuery && (
              <div className="flex-1 overflow-y-auto mt-2 dark:bg-[#18181b] p-4">
                {/* Instructors */}
                {mobileSearchResults.instructors.items.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold mb-2">Instructors</div>
                    {mobileSearchResults.instructors.items.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.id}`}
                        onClick={handleMobileSearchItemClick}
                        className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black"
                      >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-black font-semibold shadow-md bg-[#facc15]">
                          {instructor.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black dark:text-white transition-colors group-hover:text-black dark:group-hover:text-black">
                            {instructor.name}
                          </p>
                          <p className="text-xs text-black dark:text-white truncate">
                            {instructor.shortBio || "Instructor"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {/* Courses */}
                {mobileSearchResults.courses.items.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold mb-2">Courses</div>
                    {mobileSearchResults.courses.items.map((course) => (
                      <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        onClick={handleMobileSearchItemClick}
                        className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black"
                      >
                        <div className="w-12 h-8 rounded-md bg-[#facc15]/10 flex items-center justify-center shadow-sm overflow-hidden">
                          {course.thumbnail ? (
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              width={48}
                              height={32}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <svg className="w-5 h-5 text-[#facc15]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12V4m0 0L3 9m9-5l9 5" /></svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black dark:text-white transition-colors group-hover:text-black dark:group-hover:text-black truncate">
                            {course.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {course.offer ? (
                              <>
                                <span className="text-sm font-semibold text-black dark:text-white transition-colors group-hover:text-black dark:group-hover:text-black">
                                  ${course.offer}
                                </span>
                                <span className="text-sm text-black dark:text-white line-through group-hover:text-black dark:group-hover:text-black">
                                  ${course.price}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-semibold text-black dark:text-white transition-colors group-hover:text-black dark:group-hover:text-black">
                                ${course.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {/* Categories */}
                {mobileSearchResults.categories.items.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold mb-2">Categories</div>
                    {mobileSearchResults.categories.items.map((category) => (
                      <Link
                        key={category.id}
                        href={`/courses?category=${category.id}`}
                        onClick={handleMobileSearchItemClick}
                        className="block p-3 rounded-lg transition-colors group text-black dark:text-white hover:bg-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black"
                        style={{
                          background: "#facc15/10",
                          color: "#18181b",
                        }}
                      >
                        <p className="text-sm font-medium text-black dark:text-white group-hover:text-black dark:group-hover:text-black transition-colors">
                          {category.title}
                        </p>
                        <p className="text-xs text-black dark:text-white group-hover:text-black dark:group-hover:text-black mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
                {/* No Results */}
                {mobileSearchResults.instructors.items.length === 0 &&
                  mobileSearchResults.courses.items.length === 0 &&
                  mobileSearchResults.categories.items.length === 0 && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-300">
                    No results found for "{mobileSearchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
