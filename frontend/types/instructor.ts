import { InstructorSubmitData } from "@/lib/validations/instructor";
import { Course } from "./course";

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
	education: string;
	certifications?: string;
	cv: string; 
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



export interface InstructorProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  expertise: string[];
  totalStudents: number;
  totalCourses: number;
  totalEarnings: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface InstructorCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  students: number;
  rating: number;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface InstructorEarning {
  id: string;
  amount: number;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

// Instructor Dashboard Types
export interface InstructorDashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  totalRevenue: number;
  activeCourses: number;
  pendingCourses: number;
  completedCourses: number;
  averageRating: number;
  totalReviews: number;
}

export interface InstructorCourseStats {
  courseId: string;
  courseTitle: string;
  enrollmentCount: number;
  revenue: number;
  rating: number;
  reviewCount: number;
  status: string;
  createdAt: string;
  lastEnrollmentDate?: string;
}

export interface InstructorStudentStats {
  studentId: string;
  studentName: string;
  email: string;
  enrolledCourses: number;
  lastEnrollmentDate: string;
  isActive: boolean;
}

export interface RecentEnrollment {
  courseId: string;
  courseTitle: string;
  studentName: string;
  enrolledAt: string;
}

export interface InstructorDashboardResponse {
  stats: InstructorDashboardStats;
  topCourses: InstructorCourseStats[];
  recentStudents: InstructorStudentStats[];
  recentEnrollments: RecentEnrollment[];
  [key: string]: unknown;
}

export interface InstructorCardData {
  id: string;
  areaOfExpertise: string;
  professionalExperience: string;
  about?: string | undefined;
  website?: string;
  education: string;
  certifications: string;
  totalStudents: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}



export interface InstructorDetailBaseProps {
  instructor: IInstructorDetails;
  courses?: Course[];
  isCoursesLoading?: boolean;
  renderHeaderActions?: () => React.ReactNode;
  renderStatusBadges?: () => React.ReactNode;
  sidebarProps?: {
    adminActions?: React.ReactNode;
    userRole?: "USER" | "ADMIN" | "INSTRUCTOR";
  };
}


export interface InstructorFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InstructorSubmitData) => Promise<void>;
  initialData?: Partial<InstructorFormData>;
  isSubmitting?: boolean;
}


export interface InstructorActionsProps {
	instructor: IInstructorDetails;
	onApprove: () => Promise<void>;
	onDecline: () => Promise<void>;
	onToggleDelete: () => void;
	onDownloadCV: () => void;
	isDeleting: boolean;
}


