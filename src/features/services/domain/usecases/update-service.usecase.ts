// ==============================================================================
// features/services/domain/usecases/update-service.usecase.ts
// ==============================================================================
import type { IServiceRepository, UpdateServiceInput } from "../repositories/i-service.repository";
import type { ServiceEntity } from "../entities/service.entity";

export class UpdateServiceUseCase {
  constructor(private readonly repository: IServiceRepository) {}

  async execute(input: UpdateServiceInput): Promise<ServiceEntity> {
    const slug = input.translations?.en?.slug ?? (input.translations ? Object.values(input.translations)[0]?.slug : undefined);
    if (slug) {
      const isUnique = await this.repository.checkSlugUnique(slug, input.id);
      if (!isUnique) {
        throw new Error(`Slug "${slug}" is already in use by another service.`);
      }
    }
    return this.repository.updateService(input);
  }
}
