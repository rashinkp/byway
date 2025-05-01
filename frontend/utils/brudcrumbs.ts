import { NavItem } from "@/types/nav";


export function generateBreadcrumbs(pathname: string, navItems: NavItem[]) {
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return [
    { label: "Home", href: navItems[0]?.href || "/dashboard" },
    ...pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const navItem = navItems.find((item) => item.href === href);
      return {
        label:
          navItem?.label || segment.charAt(0).toUpperCase() + segment.slice(1),
        href,
      };
    }),
  ];
}
