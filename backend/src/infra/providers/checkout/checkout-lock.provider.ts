import { CheckoutLockInfo, ICheckoutLockProvider } from "../../../app/providers/checkout-lock.interface";

export class InMemoryCheckoutLockProvider implements ICheckoutLockProvider {
  private locksByUser = new Map<string, CheckoutLockInfo>();
  private locksByOrder = new Map<string, string>();

  constructor() {
    // Periodic cleanup of expired locks
    setInterval(() => this.cleanupExpired(), 60_000).unref?.();
  }

  isLocked(userId: string): boolean {
    const info = this.locksByUser.get(userId);
    if (!info) return false;
    if (Date.now() > info.expiresAt) {
      this.unlockByUser(userId);
      return false;
    }
    return true;
  }

  lock(userId: string, orderId: string, ttlMs: number): void {
    const expiresAt = Date.now() + ttlMs;
    this.locksByUser.set(userId, { orderId, expiresAt });
    this.locksByOrder.set(orderId, userId);
  }

  unlockByUser(userId: string): void {
    const info = this.locksByUser.get(userId);
    if (info) {
      this.locksByOrder.delete(info.orderId);
      this.locksByUser.delete(userId);
    }
  }

  unlockByOrder(orderId: string): void {
    const userId = this.locksByOrder.get(orderId);
    if (userId) {
      this.unlockByUser(userId);
    }
  }

  get(userId: string): CheckoutLockInfo | undefined {
    const info = this.locksByUser.get(userId);
    if (info && info.expiresAt < Date.now()) {
      this.unlockByUser(userId);
      return undefined;
    }
    return info;
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [userId, info] of this.locksByUser) {
      if (info.expiresAt <= now) {
        this.unlockByUser(userId);
      }
    }
  }
}


