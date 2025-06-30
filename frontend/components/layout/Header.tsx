"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLogout } from "@/hooks/auth/useLogout";
import { useCreateInstructor } from "@/hooks/instructor/useCreateInstructor";
import { useGetInstructorByUserId } from "@/hooks/instructor/useGetInstructorByUserId";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Bell,
  Menu,
  X,
  MessageSquare,
  ChevronDown,
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

interface HeaderProps {
  client?: { id: string; name: string };
  onNotificationClick?: () => void;
}

export function Header({ client, onNotificationClick }: HeaderProps = {}) {
  const { user, isLoading } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: createInstructor, isPending: isCreatingInstructor } =
    useCreateInstructor();
  const { data: instructorData, isLoading: isInstructorLoading } =
    useGetInstructorByUserId(false);
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const cartCount = useCartStore((state) => state.count);
  const setCartCount = useCartStore((state) => state.setCount);

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
    [createInstructor]
  );

  // Handle navigation with dropdown close
  const handleNavigation = useCallback((path: string) => {
    setIsDropdownOpen(false);
    
    // Map old paths to new profile section paths
    const pathMap: { [key: string]: string } = {
      "/user/my-courses": "/user/profile?section=courses",
      "/user/wallet": "/user/profile?section=wallet",
      "/user/transactions": "/user/profile?section=transactions",
      "/user/my-orders": "/user/profile?section=orders",
      "/user/profile": "/user/profile"
    };

    const newPath = pathMap[path] || path;
    router.push(newPath);
  }, [router]);

  // Handle logout with dropdown close
  const handleLogout = useCallback(() => {
    setIsDropdownOpen(false);
    logout();
    router.push("/login");
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
          scrolled
            ? "bg-[var(--background)] shadow-md"
            : "bg-[var(--background)]"
        )}
      >
        <div className="container mx-auto px-10 py-3">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-10">
              <Link
                href="/"
                className="text-2xl font-bold text-[var(--primary-foreground)] flex items-center gap-2 hover:text-[var(--primary-hover)] transition-colors"
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
            />
            {/* Courses and Pages links moved next to icons */}
            <nav className="flex items-center gap-4">
              <Link
                href="/courses"
                className="text-base font-medium text-[var(--primary-foreground)] hover:text-[var(--primary-hover)] px-2 py-1 rounded transition-colors"
              >
                Courses
              </Link>
              {/* Pages dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="link"
                    className="flex items-center gap-1 text-base font-medium text-[var(--primary-foreground)] hover:text-[var(--primary-hover)] px-2 py-1 rounded focus:outline-none shadow-none border-none bg-transparent"
                  >
                    Pages
                    <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-90" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-40 bg-[var(--tertiary)] text-[var(--tertiary-foreground)] shadow-lg border-0 p-1"
                >
                  <DropdownMenuItem
                    asChild
                    className="rounded hover:bg-[var(--tertiary-hover)]"
                  >
                    <Link href="/about">About</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded hover:bg-[var(--tertiary-hover)]"
                  >
                    <Link href="/contact">Contact</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded hover:bg-[var(--tertiary-hover)]"
                  >
                    <Link href="/faq">FAQ</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      <Link href="/chat">
                        <MessageSquare
                          className="w-6 h-6 text-[var(--foreground)] group-hover:text-[var(--secondary-hover)] transition-colors cursor-pointer"
                          strokeWidth={1.5}
                        />
                      </Link>
                    </div>
                    <div className="relative group">
                      <Link href="/user/cart">
                        <ShoppingCart
                          className="w-6 h-6 text-[var(--foreground)] group-hover:text-[var(--secondary-hover)] transition-colors cursor-pointer"
                          strokeWidth={1.5}
                        />
                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs rounded-full bg-black text-white font-semibold border-2 border-white shadow">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </div>
                    <div className="relative group">
                      <Bell
                        className="w-6 h-6 text-[var(--foreground)] group-hover:text-[var(--secondary-hover)] transition-colors cursor-pointer"
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
                          <div className="w-10 h-10 rounded-full bg-[var(--primary-50)] flex items-center justify-center text-[var(--primary-foreground)] font-medium border-2 border-[var(--primary-200)] group-hover:border-[var(--primary-300)] transition-all">
                            {user.name?.charAt(0) || "U"}
                          </div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 bg-[var(--tertiary)] text-[var(--tertiary-foreground)] shadow-lg border-0 p-1"
                      >
                        <DropdownMenuLabel className="text-[var(--tertiary-foreground)] font-semibold">
                          {user.name || "User"}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleNavigation("/user/profile")}
                          className="rounded hover:bg-[var(--tertiary-hover)]"
                        >
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleNavigation("/user/my-courses")}
                          className="rounded hover:bg-[var(--tertiary-hover)]"
                        >
                          My Courses
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="rounded hover:bg-[var(--tertiary-hover)]"
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
                    <Button>Sign In</Button>
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
              className="text-[var(--foreground)]"
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
              className="text-xl font-bold text-[var(--primary)] flex items-center gap-2"
            >
              Byway
            </Link>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="relative group">
                    <Link href="/chat">
                      <MessageSquare
                        className="w-6 h-6 text-[var(--secondary)] group-hover:text-[var(--secondary-hover)] transition-colors cursor-pointer"
                        strokeWidth={1.5}
                      />
                    </Link>
                  </div>
                  <div className="relative group">
                    <Link href="/user/cart">
                      <ShoppingCart
                        className="w-6 h-6 text-[var(--secondary)] group-hover:text-[var(--secondary-hover)] transition-colors cursor-pointer"
                        strokeWidth={1.5}
                      />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs rounded-full bg-black text-white font-semibold border-2 border-white shadow">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </div>
                  <div className="relative group">
                    <Bell
                      className="w-6 h-6 text-[var(--secondary)] group-hover:text-[var(--secondary-hover)] transition-colors cursor-pointer"
                      strokeWidth={1.5}
                      onClick={onNotificationClick}
                    />
                  </div>
                  <div className="relative group">
                    <Link href="/user/profile">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary-50)] flex items-center justify-center text-[var(--primary)] font-medium border-2 border-[var(--primary-200)] group-hover:border-[var(--primary-300)] transition-all">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="bg-[var(--primary)] hover:bg-[var(--primary-700)] text-[var(--background)] rounded-lg px-5 py-2 text-base font-medium">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-2 space-y-4 border-t mt-3">
              <div className="space-y-3">
                <Link
                  href="/courses"
                  className="block px-2 py-1 text-[var(--foreground)]  font-medium text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  href="/pages"
                  className="block px-2 py-1 text-[var(--foreground)]  font-medium text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pages
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
                        className="block px-2 py-1 text-[var(--foreground)] hover:text-[var(--primary)] text-base"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/user/profile?section=courses"
                        className="block px-2 py-1 text-[var(--foreground)] hover:text-[var(--primary)] text-base"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Courses
                      </Link>
                      <div className="flex justify-between items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          disabled={isLoggingOut}
                          className="w-full border-[var(--primary-200)] text-[var(--foreground)] rounded-lg text-base"
                        >
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </Button>
                      </div>
                    </>
                  )
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