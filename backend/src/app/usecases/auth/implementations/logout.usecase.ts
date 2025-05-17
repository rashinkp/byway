import { ILogoutUseCase } from "../interfaces/logout.usecase.interface";

export class LogoutUseCase implements ILogoutUseCase {
  async execute(): Promise<void> {
    // Placeholder for potential future logic (e.g., token blacklisting)
  }
}
