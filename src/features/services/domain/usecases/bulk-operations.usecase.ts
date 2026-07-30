// ==============================================================================
// features/services/domain/usecases/bulk-operations.usecase.ts
// ==============================================================================
import type { IServiceRepository } from "../repositories/i-service.repository";
import type { ServiceStatus } from "../entities/service.entity";

export class BulkDeleteServicesUseCase {
  constructor(private readonly repository: IServiceRepository) {}

  async execute(ids: string[]): Promise<void> {
    return this.repository.bulkDeleteServices(ids);
  }
}

export class BulkUpdateServiceStatusUseCase {
  constructor(private readonly repository: IServiceRepository) {}

  async execute(ids: string[], status: ServiceStatus): Promise<void> {
    return this.repository.bulkUpdateServiceStatus(ids, status);
  }
}
