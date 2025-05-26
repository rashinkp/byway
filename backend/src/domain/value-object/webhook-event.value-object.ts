export class WebhookEvent {
  constructor(
    public readonly type: string,
    public readonly data: {
      object: {
        id: string;
        payment_status: string;
        payment_intent: string;
        metadata: Record<string, string>;
        failure_message?: string;
        last_payment_error?: {
          message: string;
        };
        amount?: number;
      };
    }
  ) {}

  static create(type: string, data: any): WebhookEvent {
    return new WebhookEvent(type, data);
  }
} 