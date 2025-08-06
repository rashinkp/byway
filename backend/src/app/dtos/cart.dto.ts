// Add to Cart DTO
export interface AddToCartDto {
  courseId: string; 
  couponId?: string; 
}

// Get Cart DTO
export interface GetCartDto {
  page?: number; 
  limit?: number; 
  includeDeleted?: boolean;
}

export interface RemoveFromCartDto {
  courseId: string; 
}
