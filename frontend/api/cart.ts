import { api } from "@/api/api";
import type {
	ICart,
	ICartFormData,
	ICartListOutput,
	IGetCartResponse,
} from "@/types/cart";

export async function addToCart(payload: ICartFormData): Promise<ICart> {
	try {
		const response = await api.post<ICart>("/cart", payload);
		return response.data;
	} catch (error: unknown) {
		throw new Error(
			error instanceof Error ? error.message : "Adding course to cart failed",
		);
	}
}

export async function getCart(
	{
		page = 1,
		limit = 10,
		includeDeleted = false,
	}: { page?: number; limit?: number; includeDeleted?: boolean } = {},
): Promise<ICartListOutput> {
	try {
		const response = await api.get<IGetCartResponse>("/cart", {
			params: {
				page,
				limit,
				includeDeleted,
			},
		});
		return {
			cartItems: response.data.data.cartItems,
			total: response.data.data.total,
		};
	} catch (error: unknown) {
		throw new Error(error instanceof Error ? error.message : "Fetching cart failed");
	}
}

export async function removeFromCart(courseId: string): Promise<void> {
	try {
		await api.delete(`/cart/${courseId}`);
	} catch (error: unknown) {
		throw new Error(
			error instanceof Error ? error.message : "Removing course from cart failed",
		);
	}
}

export async function clearCart(): Promise<void> {
	try {
		await api.delete("/cart");
	} catch (error: unknown) {
		throw new Error(error instanceof Error ? error.message : "Clearing cart failed");
	}
}
