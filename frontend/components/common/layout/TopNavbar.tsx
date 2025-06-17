"use client";

import { NavItem } from "@/types/nav";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

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
  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [
      { name: "Home", href: "/", icon: Home }
    ];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const name = segment.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      breadcrumbs.push({
        name,
        href: currentPath,
        icon: undefined
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

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
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-semibold text-gray-800 capitalize">
                    {breadcrumb.icon && <breadcrumb.icon className="w-4 h-4 mr-1" />}
                    {breadcrumb.name}
                  </span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className="flex items-center hover:text-gray-800 transition-colors capitalize"
                  >
                    {breadcrumb.icon && <breadcrumb.icon className="w-4 h-4 mr-1" />}
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
