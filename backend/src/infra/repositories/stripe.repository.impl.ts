// import { PrismaClient } from "@prisma/client";
// import { IStripeRepository } from "../../app/repositories/stripe.repository";
// import { StripeCheckout } from "../../domain/entities/stripe-checkout.entity";

// export class StripeRepository implements IStripeRepository {
//   constructor(private prisma: PrismaClient) {}

//   async createCheckoutSession(checkout: StripeCheckout): Promise<StripeCheckout> {
//     const created = await this.prisma.stripeCheckoutSession.create({
//       data: checkout.toPrisma(),
//     });
//     return StripeCheckout.fromPrisma(created);
//   }

//   async findCheckoutSessionById(id: string): Promise<StripeCheckout | null> {
//     const session = await this.prisma.stripeCheckoutSession.findUnique({
//       where: { id },
//     });
//     if (!session) return null;
//     return StripeCheckout.fromPrisma(session);
//   }

//   async findCheckoutSessionBySessionId(sessionId: string): Promise<StripeCheckout | null> {
//     const session = await this.prisma.stripeCheckoutSession.findFirst({
//       where: { sessionId },
//     });
//     if (!session) return null;
//     return StripeCheckout.fromPrisma(session);
//   }

//   async updateCheckoutSession(checkout: StripeCheckout): Promise<StripeCheckout> {
//     const updated = await this.prisma.stripeCheckoutSession.update({
//       where: { id: checkout.id },
//       data: checkout.toPrisma(),
//     });
//     return StripeCheckout.fromPrisma(updated);
//   }
// } 