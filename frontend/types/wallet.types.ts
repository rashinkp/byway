export interface IWallet {
	id: string;
	userId: string;
	balance: number;
	currency: string;
	createdAt: string;
	updatedAt: string;
}

export interface WalletApiResponse<T> {
	success: boolean;
	data: T;
	message: string;
	statusCode: number;
}
