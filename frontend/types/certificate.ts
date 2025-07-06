export interface CertificateDTO {
	id: string;
	userId: string;
	courseId: string;
	enrollmentId?: string;
	certificateNumber: string;
	status: string;
	issuedAt: string | null;
	expiresAt: string | null;
	pdfUrl: string;
	metadata?: any;
	createdAt: string;
	updatedAt: string;
	// Optionally, add courseTitle, userName, userEmail if your backend returns them
	courseTitle?: string;
	userName?: string;
	userEmail?: string;
	completionDate?: string;
	averageScore?: number;
	instructorName?: string;
}
