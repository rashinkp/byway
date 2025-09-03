"use client";

import { useState, useEffect } from "react";
import { useDetailedUserData } from "@/hooks/user/useDetailedUserData";
import Sidebar from "@/components/profile/SideBarProfile";
import ProfileSection from "@/components/profile/ProfileSection";
import EditProfileForm from "@/components/profile/EditProfileForm";
import MyCoursesSection from "@/components/profile/MyCoursesSection";
import WalletSection from "@/components/profile/WalletSection";
import TransactionsSection from "@/components/profile/TransactionsSection";
import OrdersSection from "@/components/profile/OrdersSection";
import CertificatesSection from "@/components/profile/CertificatesSection";
import { useSearchParams, useRouter } from "next/navigation";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth.store";

export default function MainProfileComponent() {
  const { data: user, isLoading, error } = useDetailedUserData();
  const { isInitialized, isLoading: authLoading } = useAuthStore();
  const [activeSection, setActiveSection] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // collapsed by default on mobile
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Expand sidebar by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle query parameter for section navigation
  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      const sectionMap: { [key: string]: string } = {
        "my-courses": "courses",
        courses: "courses",
        wallet: "wallet",
        transactions: "transactions",
        orders: "orders",
        "my-orders": "orders",
        certificates: "certificates",
        profile: "profile",
        settings: "settings",
      };
      const mappedSection = sectionMap[section];
      if (mappedSection && mappedSection !== activeSection) {
        setActiveSection(mappedSection);
      }
    }
  }, [searchParams, activeSection]);

  const handleSectionChange = (section: string) => {
    if (section === activeSection) return;
    setLoadingSection(section);
    setActiveSection(section);
    const url = new URL(window.location.href);
    url.searchParams.set("section", section);
    router.replace(url.pathname + url.search, { scroll: false });
    if (window.innerWidth < 768) setSidebarCollapsed(true);
  };

  useEffect(() => {
    if (!isLoading && loadingSection) {
      setLoadingSection(null);
    }
  }, [isLoading, loadingSection]);

  // Show loading skeleton until auth is initialized and not loading
  if (isLoading || authLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#18181b] flex flex-row">
        {/* Sidebar skeleton */}
        <aside className="transition-all duration-300 w-14 md:w-64 dark:border-gray-700 shadow-lg rounded-2xl m-4 flex flex-col">
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </aside>
        {/* Main content skeleton */}
        <main className="flex-1 transition-all duration-300 p-4 md:p-8 min-w-0">
          <div className="max-w-5xl mx-auto space-y-8">
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#18181b]">
        <ErrorDisplay
          error={error}
          title="Something went wrong"
          description="An error occurred while loading your profile."
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#18181b]">
        <ErrorDisplay
          error={"No user data found"}
          title="No user data found"
          description="Please try logging in again."
        />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[#18181b] flex flex-row relative">
        {/* Sidebar for desktop */}
        <aside
          className={`hidden md:flex transition-all duration-300 ${
            sidebarCollapsed ? "w-14" : "w-64"
          }  shadow-lg rounded-2xl m-4 flex-col z-30`}
        >
          <Sidebar
            activeSection={activeSection}
            setActiveSection={handleSectionChange}
            collapsed={sidebarCollapsed}
            toggleCollapse={() => setSidebarCollapsed((c) => !c)}
            loadingSection={loadingSection}
          />
        </aside>

        {/* Sidebar for mobile: always show thin bar, overlay when expanded */}
        <aside
          className={`w-14 bg-white dark:bg-[#232326] border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl m-2 z-20 flex flex-col md:hidden transition-all duration-300 ${
            !sidebarCollapsed ? "pointer-events-none opacity-0" : ""
          }`}
        >
          <Sidebar
            activeSection={activeSection}
            setActiveSection={handleSectionChange}
            collapsed={true}
            toggleCollapse={() => setSidebarCollapsed(false)}
            loadingSection={loadingSection}
          />
        </aside>
        {/* Overlay sidebar for mobile */}
        {!sidebarCollapsed && (
          <>
            <div
              className="fixed left-0 right-0 top-[64px] bottom-0 bg-black/30 z-30 md:hidden"
              onClick={() => setSidebarCollapsed(true)}
            />
            <aside className="fixed left-0 top-[64px] h-[calc(100vh-64px)] w-64 bg-white dark:bg-[#232326] border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl m-2 z-40 flex flex-col md:hidden transition-transform duration-300">
              <Sidebar
                activeSection={activeSection}
                setActiveSection={handleSectionChange}
                collapsed={false}
                toggleCollapse={() => setSidebarCollapsed(true)}
                loadingSection={loadingSection}
              />
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 transition-all duration-300 p-4 md:p-8 min-w-0 ">
          <div className="max-w-5xl space-y-8">
            {activeSection === "profile" && (
              <ProfileSection user={user} setIsModalOpen={setIsModalOpen} />
            )}
            {activeSection === "courses" && (
              loadingSection === "courses" ? (
                <div className="w-full">
                  <div className="bg-white dark:bg-[#232326] rounded-xl p-8 mb-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#facc15] mr-3"></div>
                      <span className="text-lg text-gray-600 dark:text-gray-300">Loading courses...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <MyCoursesSection />
              )
            )}
            {activeSection === "wallet" && (
              loadingSection === "wallet" ? (
                <div className="w-full">
                  <div className="bg-white dark:bg-[#232326] rounded-xl p-8 mb-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#facc15] mr-3"></div>
                      <span className="text-lg text-gray-600 dark:text-gray-300">Loading wallet...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <WalletSection />
              )
            )}
            {activeSection === "transactions" && (
              loadingSection === "transactions" ? (
                <div className="w-full">
                  <div className="bg-white dark:bg-[#232326] rounded-xl p-8 mb-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#facc15] mr-3"></div>
                      <span className="text-lg text-gray-600 dark:text-gray-300">Loading transactions...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <TransactionsSection />
              )
            )}
            {activeSection === "orders" && (
              loadingSection === "orders" ? (
                <div className="w-full">
                  <div className="bg-white dark:bg-[#232326] rounded-xl p-8 mb-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#facc15] mr-3"></div>
                      <span className="text-lg text-gray-600 dark:text-gray-300">Loading orders...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <OrdersSection />
              )
            )}
            {activeSection === "certificates" && (
              loadingSection === "certificates" ? (
                <div className="w-full">
                  <div className="bg-white dark:bg-[#232326] rounded-xl p-8 mb-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#facc15] mr-3"></div>
                      <span className="text-lg text-gray-600 dark:text-gray-300">Loading certificates...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <CertificatesSection />
              )
            )}
            {activeSection === "settings" && (
              <div className="bg-white dark:bg-[#232326] rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize mb-2">
                  Settings
                </h2>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  Content for settings section coming soon...
                </p>
              </div>
            )}
          </div>
        </main>
        <EditProfileForm
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          user={user}
        />
      </div>
    </>
  );
}
