// ==============================================================================
// features/services/domain/usecases/delete-service.usecase.ts
// ==============================================================================
import type { IServiceRepository } from "../repositories/i-service.repository";

export class DeleteServiceUseCase {
  constructor(private readonly repository: IServiceRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteService(id);
  }
}
