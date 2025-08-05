// ============================================================================
// CATEGORY REQUEST DTOs
// ============================================================================

export interface CreateCategoryRequestDto {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryRequestDto {
  id: string;
  name?: string;
  description?: string;
  image?: string;
}

export interface GetAllCategoriesRequestDto {
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  includeDeleted?: boolean;
}

export interface GetCategoryByIdRequestDto {
  categoryId: string;
}

export interface DeleteCategoryRequestDto {
  categoryId: string;
}

// ============================================================================
// CATEGORY RESPONSE DTOs
// ============================================================================

export interface CategoryResponseDto {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CategoryListResponseDto {
  categories: CategoryResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 