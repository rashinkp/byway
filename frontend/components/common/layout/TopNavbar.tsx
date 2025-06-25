"use client";

import { NavItem } from "@/types/nav";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface TopNavbarProps {
  pathname: string;
  navItems: NavItem[];
  isCollapsible?: boolean;
  collapsed?: boolean;
  noMargin?: boolean;
}

export function TopNavbar({
  pathname,
  navItems,
  isCollapsible = false,
  collapsed = false,
  noMargin = false,
}: TopNavbarProps) {
  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [
      { name: "Home", href: "/" }
    ];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const name = segment.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      breadcrumbs.push({
        name,
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div
      className={`sticky top-0 z-10 bg-white border-b transition-all duration-300 ease-in-out ${
        noMargin
          ? ""
          : isCollapsible
            ? collapsed
              ? "lg:ml-20"
              : "lg:ml-64"
            : "lg:ml-64 lg:[&@media(min-width:1024px)]:ml-[80px] xl:ml-64"
      }`}
    >
      <div className="flex items-center min-h-10 px-6 sm:px-10 md:px-14">
        <nav aria-label="Breadcrumb" className="w-full">
          <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-gray-600 text-[15px]">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-normal text-gray-800 capitalize truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]">
                    {breadcrumb.name}
                  </span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className="hover:text-gray-800 transition-colors capitalize truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]"
                  >
                    {breadcrumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
