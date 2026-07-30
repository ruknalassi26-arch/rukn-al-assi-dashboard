// ==============================================================================
// features/about/domain/usecases/manage-core-values.usecase.ts
// Use cases for Core Values management
// ==============================================================================
import type { CoreValueEntity } from "../entities/about.entity";
import type { IAboutRepository } from "../repositories/i-about.repository";

export class GetCoreValuesUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(): Promise<CoreValueEntity[]> {
    return this.repo.getCoreValues();
  }
}

export class CreateCoreValueUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(value: Omit<CoreValueEntity, "id" | "createdAt" | "updatedAt">): Promise<CoreValueEntity> {
    const result = await this.repo.createCoreValue(value);
    await this.repo.logActivity("created", "settings", `Core Value Created: ${value.titleEn}`);
    return result;
  }
}

export class UpdateCoreValueUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string, value: Partial<CoreValueEntity>): Promise<CoreValueEntity> {
    const result = await this.repo.updateCoreValue(id, value);
    await this.repo.logActivity("updated", "settings", `Core Value Updated: ${value.titleEn ?? id}`);
    return result;
  }
}

export class DeleteCoreValueUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteCoreValue(id);
    await this.repo.logActivity("deleted", "settings", "Core Value Deleted");
  }
}

export class ReorderCoreValuesUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(orderedIds: string[]): Promise<void> {
    await this.repo.reorderCoreValues(orderedIds);
    await this.repo.logActivity("updated", "settings", "Core Values Order Changed");
  }
}

export class BulkDeleteCoreValuesUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[]): Promise<void> {
    await this.repo.bulkDeleteCoreValues(ids);
    await this.repo.logActivity("deleted", "settings", `Bulk Deleted ${ids.length} Core Values`);
  }
}

export class BulkUpdateCoreValuesStatusUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[], status: "active" | "draft"): Promise<void> {
    await this.repo.bulkUpdateCoreValuesStatus(ids, status);
    await this.repo.logActivity("updated", "settings", `Bulk Updated ${ids.length} Core Values to ${status}`);
  }
}
