export interface IClearCartUseCase {
  execute(userId: string): Promise<void>;
} 