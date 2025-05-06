import {
  ICart,
  ICreateCartInput,
  IGetCartInput,
  IRemoveCartItemInput,
  IClearCartInput,
} from "./cart.types";

export interface ICartRepository {
  createCart(input: ICreateCartInput): Promise<ICart>;
  getCart(input: IGetCartInput): Promise<{ cartItems: ICart[]; total: number }>;
  removeCartItem(input: IRemoveCartItemInput): Promise<ICart>;
  clearCart(input: IClearCartInput): Promise<void>;
  getCartItemByCourseId(
    userId: string,
    courseId: string
  ): Promise<ICart | null>;
}
