"use client";

import CommonLayout from "@/components/common/layout/CommonLayout";
import { SkeletonLayout } from "@/components/admin/SkeletonLayout";
import { ReactNode } from "react";
import { ADMIN_NAV_ITEMS } from "@/types/nav";

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
			skeleton={<SkeletonLayout />}
		>
			{children}
		</CommonLayout>
	);
}
