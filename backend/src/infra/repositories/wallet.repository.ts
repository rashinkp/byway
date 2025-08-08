import { PrismaClient } from "@prisma/client";
import { IWalletRepository } from "../../app/repositories/wallet.repository.interface";
import { Wallet } from "../../domain/entities/wallet.entity";
import { Money } from "../../domain/value-object/money.value-object";

export class WalletRepository implements IWalletRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) return null;

    return new Wallet(
      wallet.id,
      wallet.userId,
      Money.create(Number(wallet.balance)),
      wallet.createdAt,
      wallet.updatedAt
    );
  }

  async create(wallet: Wallet): Promise<Wallet> {
    const createdWallet = await this.prisma.wallet.create({
      data: {
        id: wallet.id,
        userId: wallet.userId,
        balance: wallet.balance.amount,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      },
    });

    return new Wallet(
      createdWallet.id,
      createdWallet.userId,
      Money.create(Number(createdWallet.balance)),
      createdWallet.createdAt,
      createdWallet.updatedAt
    );
  }

  async update(wallet: Wallet): Promise<Wallet> {
    const updatedWallet = await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance.amount,
        updatedAt: new Date(),
      },
    });

    return new Wallet(
      updatedWallet.id,
      updatedWallet.userId,
      Money.create(Number(updatedWallet.balance)),
      updatedWallet.createdAt,
      updatedWallet.updatedAt
    );
  }

  async findById(id: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id },
    });

    if (!wallet) return null;

    return new Wallet(
      wallet.id,
      wallet.userId,
      Money.create(Number(wallet.balance)),
      wallet.createdAt,
      wallet.updatedAt
    );
  }
}
