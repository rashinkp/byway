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
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: user, isLoading, error } = useDetailedUserData();
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
        "courses": "courses",
        "wallet": "wallet",
        "transactions": "transactions",
        "orders": "orders",
        "my-orders": "orders",
        "certificates": "certificates",
        "profile": "profile",
        "settings": "settings"
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-2">Something went wrong</div>
          <p className="text-gray-600">{error instanceof Error ? error.message : "An error occurred"}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-2">No user data found</div>
          <p className="text-gray-600">Please try logging in again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-row">
      {/* Sidebar: regular flex column, below header, above footer */}
      <aside className={`transition-all duration-300 ${sidebarCollapsed ? 'w-14' : 'w-64'} bg-white border-r border-gray-200 shadow-lg flex flex-col`}>
        <Sidebar
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          collapsed={sidebarCollapsed}
          toggleCollapse={() => setSidebarCollapsed((c) => !c)}
          loadingSection={loadingSection}
        />
      </aside>
      {/* Main Content: margin-left based on sidebar width, p-4 on mobile, p-8 on md+ */}
      <main className={`flex-1 transition-all duration-300 p-4 md:p-8 min-w-0`}>
        <div className="max-w-5xl mx-auto">
          {activeSection === "profile" && (
            <ProfileSection user={user} setIsModalOpen={setIsModalOpen} />
          )}
          {activeSection === 'courses' && (
            <MyCoursesSection />
          )}
          {activeSection === 'wallet' && (
            <WalletSection />
          )}
          {activeSection === 'transactions' && (
            <TransactionsSection />
          )}
          {activeSection === 'orders' && (
            <OrdersSection />
          )}
          {activeSection === 'certificates' && (
            <CertificatesSection />
          )}
          {activeSection === 'settings' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-800 capitalize mb-2">
                Settings
              </h2>
              <div className="h-px bg-gray-200 my-4" />
              <p className="text-gray-600">
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
  );
}
