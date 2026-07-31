// ==============================================================================
// features/authentication/domain/usecases/sign-out.usecase.ts
// ==============================================================================
import type { IAuthRepository } from "../repositories/i-auth.repository";

export class SignOutUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(): Promise<void> {
    return this.repository.signOut();
  }
}
