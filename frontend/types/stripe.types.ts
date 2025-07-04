export interface ICourseInput {
	id: string;
	title: string;
	description?: string;
	price: number;
	offer?: number;
	thumbnail?: string;
	duration?: string;
	level?: string;
}

export interface ICreateStripeCheckoutSessionInput {
	userId: string;
	courses?: {
		id: string;
		title: string;
		description: string;
		price: number;
		offer: number;
		thumbnail: string;
		duration: string;
		level: string;
	}[];
	amount?: number;
	isWalletTopUp?: boolean;
	couponCode?: string;
	orderId?: string;
	successUrl?: string;
	cancelUrl?: string;
}

export interface IStripeCheckoutSession {
	id: string;
	url: string;
	payment_status: string;
	amount_total: number;
}

export interface IStripeWebhookResponse {
	orderId: string;
	status: string;
	transactionId: string;
}

export interface StripeApiResponse<T> {
	success: boolean;
	data: T;
	message: string;
	statusCode: number;
}
