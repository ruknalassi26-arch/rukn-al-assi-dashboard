// ==============================================================================
// features/products/domain/usecases/duplicate-product.usecase.ts
// ==============================================================================
import type { IProductRepository } from "../repositories/i-product.repository";
import type { ProductEntity } from "../entities/product.entity";

export class DuplicateProductUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(id: string): Promise<ProductEntity> {
    return this.repository.duplicateProduct(id);
  }
}
