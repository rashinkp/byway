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