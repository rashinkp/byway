import { CheckoutSessionInput, CheckoutSessionRecord } from "@/app/records/checkout-session.records";
import { ICheckoutSessionRepository } from "@/app/repositories/checkout-session.repository";
import { CheckoutSessionStatus, PrismaClient } from "@prisma/client";

export class CheckoutSessionRepository implements ICheckoutSessionRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    // Allow injection for testability, or create new instance
    this.prisma = prismaClient ?? new PrismaClient();
  }

  // Create a new checkout session record in the DB
  async create(session: CheckoutSessionInput): Promise<CheckoutSessionRecord> {
    const created = await this.prisma.checkoutSession.create({
      data: {
        sessionId: session.sessionId,
        userId: session.userId,
        courseId: session.courseId,
        status: session.status,
        createdAt: new Date(),
      },
    });

    return this.toRecord(created);
  }

  async findById(id: string): Promise<CheckoutSessionRecord | null> {
    const record = await this.prisma.checkoutSession.findUnique({
      where: { id },
    });

    if (!record) return null;
    return this.toRecord(record);
  }

  async findByUserId(userId: string): Promise<CheckoutSessionRecord[]> {
    const records = await this.prisma.checkoutSession.findMany({
      where: { userId },
    });

    return records.map(this.toRecord);
  }

  async findByCourseId(courseId: string): Promise<CheckoutSessionRecord[]> {
    const records = await this.prisma.checkoutSession.findMany({
      where: { courseId },
    });

    return records.map(this.toRecord);
  }

  async update(session: CheckoutSessionInput): Promise<CheckoutSessionRecord> {
    const updated = await this.prisma.checkoutSession.update({
      where: { id: session.sessionId },
      data: {
        status: session.status,
        updatedAt: new Date(),
        // Include other updatable fields as needed
      },
    });

    return this.toRecord(updated);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.checkoutSession.delete({
      where: { id },
    });
  }

  async findBySessionId(
    sessionId: string
  ): Promise<CheckoutSessionRecord | null> {
    const record = await this.prisma.checkoutSession.findUnique({
      where: { sessionId },
    });
    return record ? this.toRecord(record) : null;
  }

  async findAnyPendingSessionForUserAndCourses(
    userId: string,
    courseIds: string[]
  ): Promise<Boolean> {
    const record =  this.prisma.checkoutSession.findMany({
      where: {
        userId,
        courseId: { in: courseIds },
        status: 'PENDING',
      },


    });

    return record !== null ? true : false;
  }

  // Helper to convert Prisma model to your domain record type
  private toRecord(model: any): CheckoutSessionRecord {
    return {
      id: model.id,
      sessionId: model.sessionId,
      userId: model.userId,
      courseId: model.courseId,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
