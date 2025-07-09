// Education details
export interface Education {
	degree: string;
	field: string;
	institution: string;
	graduationYear: number;
	certificate?: string; // URL to certificate file
}

// Professional certification
export interface Certification {
	name: string;
	issuer: string;
	issueDate: string;
	expiryDate?: string;
	certificateUrl: string;
}

// Form data for instructor application
export interface InstructorFormData {
	// Professional Information
	areaOfExpertise: string;
	professionalExperience: string;
	about?: string;
	website?: string;

	// Education
	education: string;

	// Certifications
	certifications?: string;

	// Documents
	cv: string; // URL to CV file
}

// User details from the API response
export interface IUserDetails {
	id: string;
	name: string;
	email: string;
	role: "USER" | "INSTRUCTOR" | "ADMIN";
	avatar?: string;
	deletedAt?: string | Date | null;
	createdAt: string;
}

// Instructor details from the API response
export interface IInstructorDetails {
	userId: string;
	instructorId: string;
	name: string;
	email: string;
	avatar: string | null;
	areaOfExpertise: string;
	professionalExperience: string;
	about: string | null;
	website: string | null;
	education: string;
	certifications: string;
	cv: string;
	status: string;
	totalStudents: number;
	totalCourses?: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

// Response structure for useGetInstructorByUserId hook
export interface IInstructorWithUserDetails {
	id: string;
	userId: string;
	areaOfExpertise: string;
	professionalExperience: string;
	about?: string;
	website?: string;
	education: string;
	certifications: string;
	cv: string;
	status: "PENDING" | "APPROVED" | "DECLINED";
	totalStudents: number;
	createdAt: string;
	updatedAt: string;
	user: IUserDetails;
}
