// ==============================================================================
// features/categories/domain/usecases/duplicate-category.usecase.ts
// ==============================================================================
import type { ICategoryRepository } from "../repositories/i-category.repository";
import type { CategoryEntity } from "../entities/category.entity";

export class DuplicateCategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(id: string): Promise<CategoryEntity> {
    return this.repository.duplicateCategory(id);
  }
}
