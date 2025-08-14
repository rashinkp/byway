export interface Instructor {
  id: string;
  name: string;
  avatar: string | null;
  shortBio: string;
}

export interface Course {
  id: string;
  title: string;
  thumbnail: string | null;
  price: number;
  offer?: number;
}

export interface Category {
  id: string;
  title: string;
  description: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  courseTitle: string;
  userName: string;
  issuedAt: string | null;
  pdfUrl: string;
}
export interface InstructorList {
  items: Instructor[];
  total: number;
  page: number;
  limit: number;
}

export interface CourseList {
  items: Course[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryList {
  items: Category[];
  total: number;
  page: number;
  limit: number;
}

export interface CertificateList {
  items: Certificate[];
  total: number;
  page: number;
  limit: number;
}

export interface ISearchResult {
  instructors: InstructorList;
  courses: CourseList;
  categories: CategoryList;
  certificates: CertificateList;
}
