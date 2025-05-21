"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLogout } from "@/hooks/auth/useLogout";
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
} from "lucide-react";
import { useState, useEffect } from "react";
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

interface HeaderProps {
  client?: { id: string; name: string };
}

export function Header({ client }: HeaderProps = {}) {
  const { user, isLoading } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-600 hover:bg-gray-50 text-base font-medium"
                >
                  Categories <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem>
                  <Link href="/categories/development" className="w-full">
                    Development
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/categories/business" className="w-full">
                    Business
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/categories/design" className="w-full">
                    Design
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/categories/marketing" className="w-full">
                    Marketing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    href="/categories"
                    className="w-full font-medium text-blue-600"
                  >
                    View All Categories
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for courses, topics, instructors..."
                className="w-full py-2.5 px-4 pl-10 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <nav className="flex items-center gap-4">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : user ? (
              <>
                <Link href="/instructor/apply">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 text-base font-medium"
                  >
                    Teach on Byway
                  </Button>
                </Link>
                <div className="flex items-center gap-5">
                  <Link href="/wishlist" className="relative group">
                    <Heart
                      className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors cursor-pointer"
                      strokeWidth={1.5}
                    />
                  </Link>
                  <Link href="/user/cart" className="relative group">
                    <ShoppingCart
                      className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors cursor-pointer"
                      strokeWidth={1.5}
                    />
                  </Link>
                  <Link href="/notifications" className="relative group">
                    <Bell
                      className="w-6 h-6 text-gray-600 group-hover:text-yellow-500 transition-colors cursor-pointer"
                      strokeWidth={1.5}
                    />
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-yellow-500"
                    >
                      5
                    </Badge>
                  </Link>
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
                          href="/my-courses"
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
                          router.push("/login?clearAuth=true");
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
            {user && (
              <>
                <Link href="/user/cart" className="relative group">
                  <ShoppingCart
                    className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors cursor-pointer"
                    strokeWidth={1.5}
                  />
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    2
                  </Badge>
                </Link>
                <Link href="/user/profile" className="relative group">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium border-2 border-blue-200 group-hover:border-blue-300 transition-all">
                    {user.name?.charAt(0) || "U"}
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-4 border-t mt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses"
                className="w-full py-2.5 px-4 pl-10 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <Link
                href="/categories"
                className="block px-2 py-1 text-gray-700 hover:text-blue-600 font-medium text-base"
              >
                Categories
              </Link>
              {isLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
                    href="/my-courses"
                    className="block px-2 py-1 text-gray-700 hover:text-blue-600 text-base"
                  >
                    My Courses
                  </Link>
                  <Link
                    href="/instructor/apply"
                    className="block px-2 py-1 text-gray-700 hover:text-blue-600 text-base"
                  >
                    Teach on Byway
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout();
                      router.push("/login?clearAuth=true");
                    }}
                    disabled={isLoggingOut}
                    className="w-full border-gray-300 text-gray-700 rounded-lg text-base"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
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
  );
}
