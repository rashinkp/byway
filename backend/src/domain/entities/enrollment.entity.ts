export class Enrollment {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly courseId: string,
    public readonly enrolledAt: Date,
    public readonly orderItemId?: string,
    public readonly accessStatus: 'ACTIVE' | 'BLOCKED' | 'EXPIRED' = 'ACTIVE'
  ) {}

  static create(userId: string, courseId: string, orderItemId?: string): Enrollment {
    return new Enrollment(
      crypto.randomUUID(),
      userId,
      courseId,
      new Date(),
      orderItemId
    );
  }

  static fromPersistence(raw: {
    userId: string;
    courseId: string;
    enrolledAt: Date;
    orderItemId?: string | null;
    accessStatus: 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
  }): Enrollment {
    return new Enrollment(
      `${raw.userId}-${raw.courseId}`,
      raw.userId,
      raw.courseId,
      raw.enrolledAt,
      raw.orderItemId ?? undefined,
      raw.accessStatus
    );
  }
} 