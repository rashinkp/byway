export interface IRevenueDistributionService {
  distributeRevenue(orderId: string): Promise<void>;
} 