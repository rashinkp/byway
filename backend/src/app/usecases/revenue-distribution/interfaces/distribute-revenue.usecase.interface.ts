export interface IDistributeRevenueUseCase {
  execute(orderId: string): Promise<void>;
}
