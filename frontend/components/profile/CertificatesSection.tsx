"use client";

import { useEffect } from "react";
import { useCertificateList } from "@/hooks/certificate/useCertificateList";
import { Pagination } from "@/components/ui/Pagination";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";

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
			<div className="bg-[var(--color-background)] rounded-xl  p-6 mb-8">
				<h1 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-2">
					My Certificates
				</h1>
				<p className="text-[var(--color-muted)]">
					View and download your course completion certificates
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
						{certificates.map((cert) => (
							<div
								key={cert.id}
								className="flex flex-col md:flex-row md:items-center justify-between bg-[var(--color-background)] rounded-lg p-4 mb-4"
							>
								<div>
									<div className="font-semibold text-[var(--color-primary-dark)]">
										{cert.courseTitle || cert.courseId}
									</div>
									<div className="text-sm text-[var(--color-muted)]">
										Issued:{" "}
										{cert.issuedAt
											? new Date(cert.issuedAt).toLocaleDateString()
											: "-"}
									</div>
									<div className="text-xs text-[var(--color-muted)]">
										Certificate #: {cert.certificateNumber}
									</div>
								</div>
								<div className="mt-2 md:mt-0">
									{cert.pdfUrl ? (
										<a
											href={cert.pdfUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-block px-4 py-2 bg-[var(--color-primary-dark)] text-[var(--color-surface)] rounded hover:bg-[var(--color-primary-light)] transition"
										>
											Download
										</a>
									) : (
										<span className="text-[var(--color-muted)]">
											Not available
										</span>
									)}
								</div>
							</div>
						))}
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
