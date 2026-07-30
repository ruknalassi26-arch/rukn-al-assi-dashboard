// ==============================================================================
// features/products/domain/usecases/toggle-feature-product.usecase.ts
// ==============================================================================
import type { IProductRepository } from "../repositories/i-product.repository";
import type { ProductEntity } from "../entities/product.entity";

export class ToggleFeatureProductUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(id: string, isFeatured: boolean): Promise<ProductEntity> {
    return this.repository.toggleFeatureProduct(id, isFeatured);
  }
}
