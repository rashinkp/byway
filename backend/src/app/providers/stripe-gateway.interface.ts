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

  verifySignature(event: any, signature: string): Promise<any>;
  getPaymentIntentId(event: any): string | undefined;
  isCheckoutSessionCompleted(event: any): boolean;
  parseMetadata(metadata: Record<string, string>): {
    userId: string;
    orderId?: string;
    courses?: any[];
    isWalletTopUp?: boolean;
  };
  getCheckoutSessionMetadata(paymentIntentId: string): Promise<{
    userId: string;
    orderId?: string;
    courses?: any[];
    isWalletTopUp?: boolean;
  }>;
} 