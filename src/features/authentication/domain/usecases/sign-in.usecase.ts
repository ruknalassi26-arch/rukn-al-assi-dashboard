// ==============================================================================
// features/authentication/domain/usecases/sign-in.usecase.ts
// ==============================================================================
import type { IAuthRepository, SignInInput } from "../repositories/i-auth.repository";
import type { UserProfileEntity } from "../entities/user-profile.entity";

export class SignInUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(input: SignInInput): Promise<UserProfileEntity> {
    return this.repository.signIn(input);
  }
}
