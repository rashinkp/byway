// Note: Do not import domain entities in application DTOs

// Simplified course interface for cart responses
export interface CartCourseDTO {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  price: number | null;
  offer: number | null;
  duration: number | null;
  level: string;
  lessons: number | undefined;
  rating: number | undefined;
  reviewCount: number | undefined;
  bestSeller: boolean | undefined;
}

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

export interface ApplyCouponDto {
  courseId: string;
  couponId: string; 
}


export interface CartResponseDTO {
  id: string,
  userId: string,
  courseId: string,
  couponId?: string,
  discount?: number,
  createdAt: Date,
  updatedAt?: Date,
  deletedAt?: Date,
  course?: CartCourseDTO
}