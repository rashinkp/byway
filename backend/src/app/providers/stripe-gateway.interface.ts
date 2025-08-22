export interface StripeGateway {
  createCheckoutSession(data: {
    amount: number;
    currency: string;
    metadata: Record<string, string>;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{
    id: string;
    url: string;
  }>;

  verifySignature(event: { type: string; data: { object: Record<string, unknown> } }, signature: string): Promise<{ type: string; data: { object: Record<string, unknown> } }>;
  getPaymentIntentId(event: { type: string; data: { object: Record<string, unknown> } }): string | undefined;
  isCheckoutSessionCompleted(event: { type: string; data: { object: Record<string, unknown> } }): boolean;
  parseMetadata(metadata: Record<string, string>): {
    userId: string;
    orderId?: string;
    courses?: Record<string, unknown>[];
    isWalletTopUp?: boolean;
  };
  getCheckoutSessionMetadata(paymentIntentId: string): Promise<{
    userId: string;
    orderId?: string;
    courses?: Record<string, unknown>[];
    isWalletTopUp?: boolean;
  }>;
} 