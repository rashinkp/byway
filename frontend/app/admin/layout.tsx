"use client";

import CommonLayout from "@/components/common/layout/CommonLayout";
import { ReactNode } from "react";
import { ADMIN_NAV_ITEMS } from "@/types/nav";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <CommonLayout
      sidebarHeaderTitle="Admin Panel"
      sidebarHeaderSubtitle="Management Console"
      navItems={ADMIN_NAV_ITEMS}
      role="ADMIN"
      isCollapsible={true}
      skeleton={<LoadingSpinner />}
    >
      {children}
    </CommonLayout>
  );
}
