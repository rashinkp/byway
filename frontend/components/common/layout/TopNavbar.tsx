"use client";

import { NavItem } from "@/types/nav";
import { generateBreadcrumbs } from "@/utils/brudcrumbs";
import Link from "next/link";

interface TopNavbarProps {
  pathname: string;
  navItems: NavItem[];
  isCollapsible?: boolean;
  collapsed?: boolean;
}

export function TopNavbar({
  pathname,
  navItems,
  isCollapsible = false,
  collapsed = false,
}: TopNavbarProps) {
  const breadcrumbs = generateBreadcrumbs(pathname, navItems);

  return (
    <div
      className={`sticky top-0 z-10 bg-white border-b shadow-sm transition-all duration-300 ease-in-out ${
        isCollapsible
          ? collapsed
            ? "lg:ml-20"
            : "lg:ml-64"
          : "lg:ml-64 lg:[&@media(min-width:1024px)]:ml-[80px] xl:ml-64"
      }`}
    >
      <div className="flex items-center h-16 px-4 lg:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index < breadcrumbs.length - 1 ? (
                  <>
                    <Link
                      href={crumb.href}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                    <span className="mx-2">/</span>
                  </>
                ) : (
                  <span className="font-semibold text-gray-800">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
