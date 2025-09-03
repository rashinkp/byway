export interface CheckoutLockInfo {
  orderId: string;
  expiresAt: number;
}

export interface ICheckoutLockProvider {
  isLocked(userId: string): boolean;
  lock(userId: string, orderId: string, ttlMs: number): void;
  unlockByUser(userId: string): void;
  unlockByOrder(orderId: string): void;
  get(userId: string): CheckoutLockInfo | undefined;
}


