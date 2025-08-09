export interface OrderItem {
	id: string;
	orderId: string;
	courseId: string;
	courseTitle: string;
	coursePrice: number;
	discount: number | null;
	couponId: string | null;
	// Course details flattened into order item
	title: string;
	description: string | null;
	level: string;
	price: number | null;
	thumbnail: string | null;
	status: string;
	categoryId: string;
	createdBy: string;
	deletedAt: string | null;
	approvalStatus: string;
	details: any | null;
	createdAt: string;
	updatedAt: string;
}

export type OrderStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Order {
	id: string;
	userId: string;
	amount: number;
	paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
	orderStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "FAILED" | "COMPLETED";
	paymentId: string | null;
	paymentGateway: "STRIPE" | "PAYPAL" | "RAZORPAY" | "WALLET" | null;
	createdAt: string;
	updatedAt: string;
	items: OrderItem[];
}

export interface OrdersResponse {
	orders: Order[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface GetOrdersParams {
	page?: number;
	limit?: number;
	sortBy?: "createdAt" | "amount" | "status";
	sortOrder?: "asc" | "desc";
	status?: "ALL" | "COMPLETED" | "PENDING" | "FAILED";
	startDate?: string;
	endDate?: string;
	minAmount?: number;
	maxAmount?: number;
}



export interface CourseDetail {
  prerequisites: string | null;
  longDescription: string | null;
  objectives: string | null;
  targetAudience: string | null;
}

export interface CreateOrderRequest {
  courses: {
    id: string;
    title: string;
    description: string | null;
    level: string;
    price: number;
    thumbnail: string | null;
    status: string; // required
    categoryId?: string; // required
    createdBy: string; // required (instead of creator.name)
    createdAt: string; // required
    updatedAt?: string;
    deletedAt: string | null; // required, can be null
    approvalStatus: string; // required
    details: CourseDetail | null;
    offer?: number;
  }[];
  paymentMethod: "WALLET" | "STRIPE" | "PAYPAL" | "RAZORPAY";
  couponCode?: string;
}

export interface OrderResponse {
	order: Order;
	session?: {
		id: string;
		url: string;
		payment_status: string;
		amount_total: number;
	};
}