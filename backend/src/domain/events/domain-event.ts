// Base domain event interface
export interface DomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly version: number;
}

// Base domain event class
export abstract class BaseDomainEvent implements DomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly version: number;

  constructor(aggregateId: string, version: number = 1) {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
    this.eventType = this.constructor.name;
    this.aggregateId = aggregateId;
    this.version = version;
  }
}

// User-related domain events
export class UserCreatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly email: string,
    public readonly name: string,
    version: number = 1
  ) {
    super(aggregateId, version);
  }
}

export class UserUpdatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly updatedFields: Record<string, unknown>,
    version: number = 1
  ) {
    super(aggregateId, version);
  }
}

export class UserDeletedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly deletedBy: string,
    version: number = 1
  ) {
    super(aggregateId, version);
  }
}

// Course-related domain events
export class CourseCreatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly title: string,
    public readonly instructorId: string,
    version: number = 1
  ) {
    super(aggregateId, version);
  }
}

export class CourseApprovedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly approvedBy: string,
    version: number = 1
  ) {
    super(aggregateId, version);
  }
}

export class CourseEnrolledEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly enrolledAt: Date,
    version: number = 1
  ) {
    super(aggregateId, version);
  }
}

// Order-related domain events
export class OrderCreatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly userId: string,
    public readonly totalAmount: number,
    version: number = 1
  ) {
    super(aggregateId, version);
  }
}

export class OrderPaidEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly paymentId: string,
    public readonly paidAt: Date,
    version: number = 1
  ) {
    super(aggregateId, version);
  }
}

// Payment-related domain events
export class PaymentProcessedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly amount: number,
    public readonly status: string,
    public readonly processedAt: Date,
    version: number = 1
  ) {
    super(aggregateId, version);
  }
}

// Wallet-related domain events
export class WalletFundedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly amount: number,
    public readonly fundedAt: Date,
    version: number = 1
  ) {
    super(aggregateId, version);
  }
}

export class WalletDebitedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly amount: number,
    public readonly debitedAt: Date,
    version: number = 1
  ) {
    super(aggregateId, version);
  }
}

// Domain event handler interface
export interface DomainEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

// Domain event bus interface
export interface DomainEventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: DomainEventHandler<T>
  ): void;
  unsubscribe<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: DomainEventHandler<T>
  ): void;
}
