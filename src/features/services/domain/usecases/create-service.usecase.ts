// ==============================================================================
// features/services/domain/usecases/create-service.usecase.ts
// ==============================================================================
import type { IServiceRepository, CreateServiceInput } from "../repositories/i-service.repository";
import type { ServiceEntity } from "../entities/service.entity";

export class CreateServiceUseCase {
  constructor(private readonly repository: IServiceRepository) {}

  async execute(input: CreateServiceInput): Promise<ServiceEntity> {
    const slug = input.translations?.en?.slug ?? Object.values(input.translations ?? {})[0]?.slug;
    if (slug) {
      const isUnique = await this.repository.checkSlugUnique(slug);
      if (!isUnique) {
        throw new Error(`Slug "${slug}" is already in use by another service.`);
      }
    }
    return this.repository.createService(input);
  }
}
