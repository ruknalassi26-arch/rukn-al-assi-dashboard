// ==============================================================================
// features/services/domain/usecases/get-services.usecase.ts
// ==============================================================================
import type { IServiceRepository, ServiceFilterParams, PaginatedServices } from "../repositories/i-service.repository";

export class GetServicesUseCase {
  constructor(private readonly repository: IServiceRepository) {}

  async execute(params?: ServiceFilterParams): Promise<PaginatedServices> {
    return this.repository.getServices(params);
  }
}
