import { PrismaClient } from "@prisma/client";
import { IWalletRepository } from "../../app/repositories/wallet.repository.interface";
import { Wallet } from "../../domain/entities/wallet.entity";
import { Money } from "../../domain/value-object/money.value-object";
import { GenericRepository } from "./base/generic.repository";

export class WalletRepository extends GenericRepository<Wallet> implements IWalletRepository {
  constructor(private readonly _prisma: PrismaClient) {
    super(_prisma, 'wallet');
  }

  protected getPrismaModel() {
    return this._prisma.wallet;
  }

  protected mapToEntity(wallet: any): Wallet {
    return new Wallet(
      wallet.id,
      wallet.userId,
      Money.create(Number(wallet.balance)),
      wallet.createdAt,
      wallet.updatedAt
    );
  }

  protected mapToPrismaData(entity: any): any {
    if (entity instanceof Wallet) {
      return {
        id: entity.id,
        userId: entity.userId,
        balance: entity.balance.amount,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      };
    }
    return entity;
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const wallet = await this._prisma.wallet.findUnique({
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
    const createdWallet = await this._prisma.wallet.create({
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
    const updatedWallet = await this._prisma.wallet.update({
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
    return this.findByIdGeneric(id);
  }
}
