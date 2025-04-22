import { NAV_ITEMS } from "../Sidebar/NavItemLink";
import Link from "next/link";

export function TopNavbar({ pathname }: { pathname: string }) {
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const breadcrumbs = [
    { label: "Home", href: "/admin/dashboard" },
    ...pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const navItem = NAV_ITEMS.find((item) => item.href === href);
      return {
        label: navItem?.label || segment.charAt(0).toUpperCase() + segment.slice(1),
        href,
      };
    }),
  ];

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