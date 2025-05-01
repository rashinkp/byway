
import { NavItem } from "@/types/nav";
import { generateBreadcrumbs } from "@/utils/brudcrumbs";
import Link from "next/link";

interface TopNavbarProps {
  pathname: string;
  navItems: NavItem[];
}

export function TopNavbar({ pathname, navItems }: TopNavbarProps) {
  const breadcrumbs = generateBreadcrumbs(pathname, navItems);

  return (
    <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="flex items-center h-16 px-4 lg:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center">
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
