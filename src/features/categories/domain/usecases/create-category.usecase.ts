// ==============================================================================
// features/categories/domain/usecases/create-category.usecase.ts
// ==============================================================================
import type { ICategoryRepository, CreateCategoryInput } from "../repositories/i-category.repository";
import type { CategoryEntity } from "../entities/category.entity";

export class CreateCategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CategoryEntity> {
    return this.repository.createCategory(input);
  }
}
