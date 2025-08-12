export interface PaginationFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  search?: string;
  filterBy?: string;
  role?: string;
  
}


export interface FilterCourse extends PaginationFilter {
  userId?: string;
  myCourses?: boolean;
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED" | "All";
  duration?: "All" | "Under5" | "5to10" | "Over10";
  price?: "All" | "Free" | "Paid";
  categoryId?: string;
}




export interface PaginatedResult<T> {
  items: T[];
  total?: number;
  totalPage?: number;
}