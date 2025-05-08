import { ICreateOrderInput, ICaptureOrderInput } from "./paypal.types";

export interface IPaypalRepository {
  storeOrder(input: ICreateOrderInput & { orderId: string }): Promise<void>;
  updateOrderStatus(
    input: ICaptureOrderInput & { transactionId: string }
  ): Promise<void>;
}
