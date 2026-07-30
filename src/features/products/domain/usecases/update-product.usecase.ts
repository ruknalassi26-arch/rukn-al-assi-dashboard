// ==============================================================================
// features/products/domain/usecases/update-product.usecase.ts
// ==============================================================================
import type { IProductRepository, UpdateProductInput } from "../repositories/i-product.repository";
import type { ProductEntity } from "../entities/product.entity";

export class UpdateProductUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(input: UpdateProductInput): Promise<ProductEntity> {
    if (input.slug) {
      const isUnique = await this.repository.checkSlugUnique(input.slug, input.id);
      if (!isUnique) {
        throw new Error(`Slug "${input.slug}" is already in use by another product.`);
      }
    }
    return this.repository.updateProduct(input);
  }
}
