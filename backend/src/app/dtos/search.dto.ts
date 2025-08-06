export interface ISearchParams {
  query: string;
  page?: number; // default 1 can be applied in service
  limit?: number; // default 10 can be applied in service
  userId?: string;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
}


export interface IInstructorItem {
  id: string;
  name: string;
  avatar: string | null;
  shortBio: string;
}

export interface IInstructorSearchResult {
  items: IInstructorItem[];
  total: number;
  page: number;
  limit: number;
}



export interface ICourseItem {
  id: string;
  title: string;
  thumbnail: string | null;
  price: number;
  offer?: number;
}

export interface ICourseSearchResult {
  items: ICourseItem[];
  total: number;
  page: number;
  limit: number;
}


export interface ICertificateItem {
  id: string;
  certificateNumber: string;
  courseTitle: string;
  userName: string;
  issuedAt: string | null;
  pdfUrl: string;
}

export interface ICertificateSearchResult {
  items: ICertificateItem[];
  total: number;
  page: number;
  limit: number;
}


export interface ICategoryItem {
  id: string;
  title: string;
  description: string;
}

export interface ICategorySearchResult {
  items: ICategoryItem[];
  total: number;
  page: number;
  limit: number;
}


export interface ISearchResult {
  instructors: IInstructorSearchResult;
  courses: ICourseSearchResult;
  categories: ICategorySearchResult;
  certificates: ICertificateSearchResult;
}
