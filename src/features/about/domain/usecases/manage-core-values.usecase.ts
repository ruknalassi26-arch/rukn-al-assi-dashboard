// ==============================================================================
// features/about/domain/usecases/manage-core-values.usecase.ts
// Use cases for Core Values management
// ==============================================================================
import type { CoreValueEntity, SectionStatus } from "../entities/about.entity";
import type { IAboutRepository, SaveCoreValueInput } from "../repositories/i-about.repository";

export class GetCoreValuesUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(): Promise<CoreValueEntity[]> {
    return this.repo.getCoreValues();
  }
}

export class CreateCoreValueUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(input: SaveCoreValueInput): Promise<CoreValueEntity> {
    const result = await this.repo.createCoreValue(input);
    await this.repo.logActivity("created", "core_values", "Core Value Created");
    return result;
  }
}

export class UpdateCoreValueUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string, input: SaveCoreValueInput): Promise<CoreValueEntity> {
    const result = await this.repo.updateCoreValue(id, input);
    await this.repo.logActivity("updated", "core_values", "Core Value Updated");
    return result;
  }
}

export class DeleteCoreValueUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteCoreValue(id);
    await this.repo.logActivity("deleted", "core_values", "Core Value Deleted");
  }
}

export class ReorderCoreValuesUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(orderedIds: string[]): Promise<void> {
    await this.repo.reorderCoreValues(orderedIds);
    await this.repo.logActivity("updated", "core_values", "Core Values Order Changed");
  }
}

export class BulkDeleteCoreValuesUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[]): Promise<void> {
    await this.repo.bulkDeleteCoreValues(ids);
    await this.repo.logActivity("deleted", "core_values", `Bulk Delete ${ids.length} Core Values`);
  }
}

export class BulkUpdateCoreValuesStatusUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[], status: SectionStatus): Promise<void> {
    await this.repo.bulkUpdateCoreValuesStatus(ids, status);
    await this.repo.logActivity("updated", "core_values", `Bulk Status ${status} Core Values`);
  }
}
