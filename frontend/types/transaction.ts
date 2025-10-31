export interface Transaction {
	id: string;
	userId: string;
	orderId: string;
	amount: number;
	status: "COMPLETED" | "FAILED" | "PENDING";
	paymentGateway: string | null;
	createdAt: string;
	updatedAt?: string;
	type:
		| "PURCHASE"
		| "PAYMENT"
		| "REFUND"
		| "WALLET_TOPUP"
		| "WALLET_WITHDRAWAL";
	failureReason?: string;
	courseId?: string | null;
	transactionId?: string | null;
	description?: string | null;
	order?: {
		id: string;
		items: Array<{
			courseId: string;
			title: string;
			description: string | null;
			price: number | null;
			coursePrice: number;
			thumbnail: string | null;
			level: string;
		}>;
	};
}
