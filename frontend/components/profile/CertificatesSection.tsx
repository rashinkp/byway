"use client";

import { useEffect } from "react";
import { useCertificateList } from "@/hooks/certificate/useCertificateList";
import { Pagination } from "@/components/ui/Pagination";
import { Loader2 } from "lucide-react";

export default function CertificatesSection() {
  const {
    certificates,
    loading,
    error,
    fetchCertificates,
    page,
    setPage,
    totalPages,
  } = useCertificateList();

  // Fetch certificates on mount and when page changes
  useEffect(() => {
    fetchCertificates(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Certificates</h1>
        <p className="text-gray-600">View and download your course completion certificates</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Results area */}
        {loading ? (
          <div className="flex items-center gap-2 text-blue-600"><Loader2 className="animate-spin" /> Loading certificates...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : certificates.length === 0 ? (
          <div className="text-gray-500">No certificates found.</div>
        ) : (
          <>
            {certificates.map(cert => (
              <div key={cert.id} className="flex flex-col md:flex-row md:items-center justify-between bg-blue-50/60 border border-blue-100 rounded-lg p-4 mb-4">
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
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 