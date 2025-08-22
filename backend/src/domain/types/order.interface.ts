import { Order } from "../entities/order.entity";

// Domain interface for order filters (not DTO)
export interface OrderFilters {
  page?: number; // default 1
  limit?: number; // default 10
  sortBy?: "createdAt" | "amount" | "status"; // default "createdAt"
  sortOrder?: "asc" | "desc"; // default "desc"
  status?: "ALL" | "COMPLETED" | "PENDING" | "FAILED"; // default "ALL"
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Domain interface for paginated order results (not DTO)
export interface PaginatedOrderResult {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Domain interface for order item creation (not DTO)
export interface OrderItemCreation {
  id: string;
  orderId: string;
  courseId: string;
}

// Domain interface for course data in order context (not DTO)
export interface CourseOrderData {
  id: string;
  title: string;
  description: string | null;
  level: string;
  price: number;
  thumbnail: string | null;
  status: string;
  categoryId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt: string | null;
  approvalStatus: string;
  details: {
    prerequisites: string | null;
    longDescription: string | null;
    objectives: string | null;
    targetAudience: string | null;
  } | null;
  offer?: number;
}
