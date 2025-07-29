export interface IPaypalOrder {
	status: string;
	order: {
		id: string;
		intent: string;
		purchase_units: Array<{
			reference_id: string;
			amount: { currency_code: string; value: string };
			payee: { email_address: string; merchant_id: string };
		}>;
		create_time: string;
		links: Array<{ href: string; rel: string; method: string }>;
	};
}

export interface IPaypalWallet {
	balance: number;
	transactionId: string;
}

export interface ICreatePaypalOrderInput {
	userId: string;
	order_price: string;
}

export interface ICapturePaypalOrderInput {
	orderID: string;
	userId: string;
}
