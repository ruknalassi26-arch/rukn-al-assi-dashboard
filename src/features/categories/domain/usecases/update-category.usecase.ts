// ==============================================================================
// features/categories/domain/usecases/update-category.usecase.ts
// ==============================================================================
import type { ICategoryRepository, UpdateCategoryInput } from "../repositories/i-category.repository";
import type { CategoryEntity } from "../entities/category.entity";

export class UpdateCategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<CategoryEntity> {
    return this.repository.updateCategory(input);
  }
}
