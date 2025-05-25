export class Enrollment {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly courseId: string,
    public readonly enrolledAt: Date
  ) {}

  static create(userId: string, courseId: string): Enrollment {
    return new Enrollment(
      crypto.randomUUID(),
      userId,
      courseId,
      new Date()
    );
  }
} 