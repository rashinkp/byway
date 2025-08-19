# Generic Repository Pattern Implementation

This document explains the Generic Repository pattern implementation in the Byway backend, which provides common CRUD operations while maintaining Clean Architecture principles.

## Overview

The Generic Repository pattern has been implemented to reduce code duplication across repository implementations while preserving the existing Clean Architecture structure. The pattern provides:

- Common CRUD operations (create, read, update, delete)
- Type safety with TypeScript
- Soft delete functionality
- Pagination and search utilities
- Maintains existing repository interfaces

## Architecture

### Base Generic Repository

The `GenericRepository<T>` abstract class provides:

```typescript
export abstract class GenericRepository<T> {
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelName: string
  ) {}

  // Abstract methods that must be implemented by concrete repositories
  protected abstract getPrismaModel(): any;
  protected abstract mapToEntity(data: any): T;
  protected abstract mapToPrismaData(entity: any): any;

  // Protected generic methods for common operations
  protected async findByIdGeneric(id: string): Promise<T | null>
  protected async findGeneric(filter?: any): Promise<T[]>
  protected async createGeneric(data: any): Promise<T>
  protected async updateGeneric(id: string, data: any): Promise<T>
  protected async deleteGeneric(id: string): Promise<void>
  protected async softDeleteGeneric(id: string): Promise<void>
  protected async countGeneric(filter?: any): Promise<number>
}
```

### Key Features

1. **Type Safety**: Uses TypeScript generics to ensure type safety
2. **Clean Architecture Compliance**: Repository interfaces remain unchanged
3. **Soft Delete Support**: Built-in soft delete functionality
4. **Utility Methods**: Pagination and search query builders
5. **Flexible Mapping**: Custom entity-to-prisma mapping for each repository

## Implementation Examples

### Simple Repository (Wallet)

```typescript
export class WalletRepository extends GenericRepository<Wallet> implements IWalletRepository {
  constructor(private _prisma: PrismaClient) {
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

  // Use generic methods for common operations
  async findById(id: string): Promise<Wallet | null> {
    return this.findByIdGeneric(id);
  }

  // Keep entity-specific methods
  async findByUserId(userId: string): Promise<Wallet | null> {
    const wallet = await this._prisma.wallet.findUnique({
      where: { userId },
    });
    return wallet ? this.mapToEntity(wallet) : null;
  }
}
```

### Complex Repository (Cart)

```typescript
export class CartRepository extends GenericRepository<Cart> implements ICartRepository {
  constructor(private _prisma: PrismaClient) {
    super(_prisma, 'cart');
  }

  protected getPrismaModel() {
    return this._prisma.cart;
  }

  protected mapToEntity(cart: any): Cart {
    return Cart.fromPersistence({
      ...cart,
      discount: Number(cart.discount),
    });
  }

  protected mapToPrismaData(entity: any): any {
    if (entity instanceof Cart) {
      return {
        userId: entity.userId,
        courseId: entity.courseId,
        couponId: entity.couponId,
        discount: new Prisma.Decimal(entity.discount ?? 0),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
      };
    }
    return entity;
  }

  // Override findById to include relations
  async findById(id: string): Promise<Cart | null> {
    const cart = await this._prisma.cart.findUnique({
      where: { id },
      include: { course: true },
    });
    return cart ? this.mapToEntity(cart) : null;
  }

  // Keep entity-specific methods
  async findByUserId(userId: string, includeDeleted: boolean = false): Promise<Cart[]> {
    const carts = await this._prisma.cart.findMany({
      where: {
        userId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      include: { course: true },
    });
    return carts.map(cart => this.mapToEntity(cart));
  }
}
```

## Migration Guide

### Step 1: Import GenericRepository

```typescript
import { GenericRepository } from "./base/generic.repository";
```

### Step 2: Extend GenericRepository

```typescript
export class YourRepository extends GenericRepository<YourEntity> implements IYourRepository {
  constructor(private _prisma: PrismaClient) {
    super(_prisma, 'yourModelName');
  }
}
```

### Step 3: Implement Abstract Methods

```typescript
protected getPrismaModel() {
  return this._prisma.yourModel;
}

protected mapToEntity(data: any): YourEntity {
  return YourEntity.fromPersistence(data);
}

protected mapToPrismaData(entity: any): any {
  if (entity instanceof YourEntity) {
    return entity.toJSON();
  }
  return entity;
}
```

### Step 4: Replace Common Operations

Replace existing CRUD operations with generic methods:

```typescript
// Before
async findById(id: string): Promise<YourEntity | null> {
  const entity = await this._prisma.yourModel.findUnique({
    where: { id, deletedAt: null },
  });
  return entity ? YourEntity.fromPersistence(entity) : null;
}

// After
async findById(id: string): Promise<YourEntity | null> {
  return this.findByIdGeneric(id);
}
```

### Step 5: Keep Entity-Specific Methods

Entity-specific methods like `findByEmail`, `findByUserId`, etc., should remain as they are, but can use the `mapToEntity` method for consistency.

## Benefits

1. **Reduced Code Duplication**: Common CRUD operations are centralized
2. **Consistent Behavior**: All repositories handle soft deletes, timestamps, etc. consistently
3. **Type Safety**: Full TypeScript support with generics
4. **Maintainability**: Changes to common operations only need to be made in one place
5. **Clean Architecture**: Repository interfaces remain unchanged
6. **Flexibility**: Each repository can still implement custom methods

## Best Practices

1. **Always implement the three abstract methods**: `getPrismaModel`, `mapToEntity`, `mapToPrismaData`
2. **Use `mapToEntity` consistently**: For all data mapping operations
3. **Override when needed**: Override generic methods when you need custom behavior (e.g., includes)
4. **Keep entity-specific methods**: Don't try to force everything into the generic pattern
5. **Test thoroughly**: Ensure all existing functionality works after migration

## Limitations

1. **Complex Queries**: Very complex queries with multiple includes may need custom implementation
2. **Performance**: Generic methods may not be optimized for specific use cases
3. **Learning Curve**: Team members need to understand the pattern

## Future Enhancements

1. **Query Builder**: Add a query builder for complex operations
2. **Caching**: Add caching support to generic methods
3. **Bulk Operations**: Add bulk create, update, delete operations
4. **Audit Trail**: Add automatic audit trail functionality
