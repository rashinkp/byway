"use client";

import { useState, useEffect } from "react";
import { useDetailedUserData } from "@/hooks/user/useDetailedUserData";
import Sidebar from "@/components/profile/SideBarProfile";
import ProfileSection from "@/components/profile/ProfileSection";
import EditProfileForm from "@/components/profile/EditProfileForm";
import MyCoursesPage from "../my-courses/page";
import WalletTransactionPage from "../wallet/page";
import TransactionsPage from "../transactions/page";
import OrderListing from "../my-orders/page";
import { Loader2 } from "lucide-react";
import { useCertificateList } from "@/hooks/certificate/useCertificateList";

export default function ProfilePage() {
  const { data: user, isLoading, error } = useDetailedUserData();
  const [activeSection, setActiveSection] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);


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
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {activeSection === "profile" && (
              <ProfileSection user={user} setIsModalOpen={setIsModalOpen} />
            )}

            {activeSection === 'courses' && (
              <MyCoursesPage />
            )}
            {activeSection === 'wallet' && (
              <WalletTransactionPage />
            )}
            {activeSection === 'transactions' && (
              <TransactionsPage />
            )}
            {activeSection === 'orders' && (
              <OrderListing />
            )}
            {["certificates", "settings"].map(
              (section) =>
                activeSection === section && (
                  <div key={section} className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-gray-800 capitalize mb-2">
                      {section}
                    </h2>
                    <div className="h-px bg-gray-200 my-4" />
                    {section === "certificates" ? (
                      <UserCertificates />
                    ) : (
                      <p className="text-gray-600">
                        Content for {section} section coming soon...
                      </p>
                    )}
                  </div>
                )
            )}
          </div>
        </main>
      </div>
      <EditProfileForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        user={user}
      />
    </div>
  );
}

function UserCertificates() {
  const { certificates, loading, error, fetchCertificates } = useCertificateList();
  const [fetched, setFetched] = useState(false);

  // Fetch certificates on mount
  useEffect(() => {
    if (!fetched) {
      fetchCertificates();
      setFetched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="flex items-center gap-2 text-blue-600"><Loader2 className="animate-spin" /> Loading certificates...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  if (!certificates.length) {
    return <div className="text-gray-500">No certificates found.</div>;
  }
  return (
    <div className="space-y-4">
      {certificates.map(cert => (
        <div key={cert.id} className="flex flex-col md:flex-row md:items-center justify-between bg-blue-50/60 border border-blue-100 rounded-lg p-4">
          <div>
            <div className="font-semibold text-blue-900">{cert.courseTitle || cert.courseId}</div>
            <div className="text-sm text-gray-600">Issued: {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "-"}</div>
            <div className="text-xs text-gray-400">Certificate #: {cert.certificateNumber}</div>
          </div>
          <div className="mt-2 md:mt-0">
            {cert.pdfUrl ? (
              <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Download</a>
            ) : (
              <span className="text-gray-400">Not available</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
