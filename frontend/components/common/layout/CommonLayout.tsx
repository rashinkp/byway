"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/auth/useLogout";
import { CommonSidebar } from "@/components/common/layout/CommonSidebar";
import NotificationModal from "@/components/notifications/NotificationModal";
import BywayFooter from "@/components/layout/Footer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface CommonLayoutProps {
	children: React.ReactNode;
	sidebarHeaderTitle: string;
	sidebarHeaderSubtitle: string;
	navItems: Array<{
		label: string;
		href: string;
		icon?: React.ComponentType<{ className?: string }>;
		children?: Array<{ label: string; href: string }>;
	}>;
	role: string;
	isCollapsible?: boolean;
	skeleton?: React.ReactNode;
}

export default function CommonLayout({
	children,
	sidebarHeaderTitle,
	sidebarHeaderSubtitle,
	navItems,
	role,
	isCollapsible = false,
}: CommonLayoutProps) {
	const { user, isInitialized, initializeAuth } = useAuthStore();
	const { logout } = useLogout();
	const router = useRouter();
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState(isCollapsible);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	// Initialize auth on mount
	useEffect(() => {
		if (!isInitialized) {
			initializeAuth();
		}
	}, [isInitialized, initializeAuth]);


	// Handle screen size for collapsible sidebar
	useEffect(() => {
		if (isCollapsible) {
			const checkScreenSize = () => {
				setCollapsed(window.innerWidth < 1024);
			};
			checkScreenSize();
			window.addEventListener("resize", checkScreenSize);
			return () => window.removeEventListener("resize", checkScreenSize);
		}
	}, [isCollapsible]);

	// Handle role-based redirects
	useEffect(() => {
		if (isInitialized) {
			if (!user) {
				router.replace("/login");
				return;
			}
			if (user.role !== role) {
				router.replace("/login");
				return;
			}
		}
	}, [user, role, isInitialized, router]);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			logout(undefined, {
				onSuccess: () => {
					setIsLoggingOut(false);
					router.replace("/login");
				},
				onError: () => {
					setIsLoggingOut(false);
					router.replace("/login");
				},
			});
		} catch  {
			setIsLoggingOut(false);
			router.replace("/login");
		}
	};



	// Show skeleton while loading
	if (!isInitialized) {
		return <LoadingSpinner />;
	}

	if (isLoggingOut) {
		return <LoadingSpinner />;
	}

	// Show nothing if not authorized
	if (!user || user.role !== role) {
		return null;
	}

	return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#18181b]">
      <CommonSidebar
        collapsed={collapsed}
        toggleCollapse={
          isCollapsible ? () => setCollapsed(!collapsed) : undefined
        }
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        pathname={pathname}
        handleLogout={handleLogout}
        headerTitle={sidebarHeaderTitle}
        headerSubtitle={sidebarHeaderSubtitle}
        navItems={navItems}
        isCollapsible={isCollapsible}
        onNotificationClick={() => setNotificationOpen(true)}
      />
      <NotificationModal
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
      />
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-[#18181b]">
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isCollapsible
              ? collapsed
                ? "lg:ml-20"
                : "lg:ml-64"
              : "lg:ml-64 lg:[&@media(min-width:1024px)]:ml-[80px] xl:ml-64"
          }`}
        >
          <div className="p-4 lg:p-6">
            <div className="max-w-7xl mx-auto text-gray-900 dark:text-gray-100">{children}</div>
          </div>
        </main>
        <div
          className={`${
            isCollapsible
              ? collapsed
                ? "lg:ml-20"
                : "lg:ml-64"
              : "lg:ml-64 lg:[&@media(min-width:1024px)]:ml-[80px] xl:ml-64"
          }`}
        >
          <BywayFooter />
        </div>
      </div>
    </div>
  );
}
