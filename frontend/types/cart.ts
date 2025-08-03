export interface Course {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	price: number;
	offer: number;
	duration: string;
	lectures: number;
	level: string;
	creator: {
		name: string;
	};
}

export interface ICart {
	id: string;
	userId: string;
	courseId: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
	couponId?: string | null;
	discount?: number;
	course?: Course;
}

export interface ICartFormData {
	courseId: string;
}

export interface IApplyCouponInput {
	couponCode: string;
}

export interface ICoupon {
	id: string;
	code: string;
	discountType: "PERCENTAGE" | "FIXED";
	discountValue: number;
	minAmount?: number;
	maxAmount?: number;
	expiresAt?: string | null;
}

export interface ICartListOutput {
	cartItems: ICart[];
	total: number;
}

export interface IGetCartResponse {
	status: string;
	data: ICartListOutput;
	message: string;
	statusCode: number;
}

export interface IGetCartInput {
	page?: number;
	limit?: number;
	includeDeleted?: boolean;
}



export interface CartItemProps {
  item: ICart;
  isRemoving: boolean;
  onRemove: (courseId: string) => void;
}


export interface CartItemsProps {
  cart: ICart[];
  isRemoving: boolean;
  removingCourseId?: string;
  onRemoveCourse: (courseId: string) => void;
}


export 
interface OrderSummaryProps {
  cart: ICart[];
}