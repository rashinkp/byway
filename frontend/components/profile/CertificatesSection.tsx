"use client";

import { useEffect } from "react";
import { useCertificateList } from "@/hooks/certificate/useCertificateList";
import { Pagination } from "@/components/ui/Pagination";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { useSignedUrl } from "@/hooks/file/useSignedUrl";

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
			<div className="bg-white dark:bg-[#232326] rounded-xl p-8 mb-8 text-center">
				<h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">My Certificates</h1>
				<p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
					View and download your course completion certificates.
				</p>
			</div>

			<div className="rounded-xl p-6">
				{/* Results area */}
				{loading ? (
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className="h-20 w-full rounded-lg" />
						))}
					</div>
				) : error ? (
					<ErrorDisplay
						error={error}
						onRetry={() => fetchCertificates(page)}
						title="Certificate Error"
						description="There was a problem loading your certificates. Please try again."
					/>
				) : certificates.length === 0 ? (
					<div className="text-gray-500">No certificates found.</div>
				) : (
					<>
										{certificates.map((cert) => {
					// Get signed URL for certificate PDF if it exists
					const isPdfKey = cert.pdfUrl && !cert.pdfUrl.startsWith('http');
					const { url: signedPdfUrl, isLoading: pdfUrlLoading } = useSignedUrl(
						isPdfKey ? cert.pdfUrl : null,
						3600, // 1 hour expiry
						false // No auto-refresh
					);

					return (
						<div
							key={cert.id}
							className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-[#232326] rounded-lg p-4 mb-4"
						>
							<div className="space-y-2">
								<div className="font-semibold text-[var(--color-primary-dark)]">
									{cert.courseTitle || cert.courseId}
								</div>
								<div className="text-sm text-[var(--color-muted)]">
									Issued:{" "}
									{cert.metadata?.generatedAt
										? new Date(cert.metadata.generatedAt).toLocaleDateString()
										: "-"}
								</div>
								<div className="text-xs text-[var(--color-muted)]">
									Certificate #: {cert.certificateNumber}
								</div>
							</div>
							<div className="mt-2 md:mt-0">
								{cert.pdfUrl ? (
									<a
										href={signedPdfUrl || cert.pdfUrl}
										target="_blank"
										rel="noopener noreferrer"
										className={`inline-block px-4 py-2 rounded transition ${
											pdfUrlLoading 
												? "bg-gray-400 text-white cursor-not-allowed" 
												: "text-[#facc15] hover:text-[#eab308]"
										}`}
									>
										{pdfUrlLoading ? "Preparing..." : "Download"}
									</a>
								) : (
									<span className="text-[var(--color-muted)]">
										Not available
									</span>
								)}
							</div>
						</div>
					);
				})}
						{totalPages > 1 && (
							<div className="mt-8 flex justify-center">
								<Pagination
									currentPage={page}
									totalPages={totalPages}
									onPageChange={setPage}
								/>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
