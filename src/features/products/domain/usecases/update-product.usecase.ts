// ==============================================================================
// features/products/domain/usecases/update-product.usecase.ts
// ==============================================================================
import type { IProductRepository, UpdateProductInput } from "../repositories/i-product.repository";
import type { ProductEntity } from "../entities/product.entity";

export class UpdateProductUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(input: UpdateProductInput): Promise<ProductEntity> {
    const slug = input.translations?.en?.slug ?? (input.translations ? Object.values(input.translations)[0]?.slug : undefined);
    if (slug) {
      const isUnique = await this.repository.checkSlugUnique(slug, input.id);
      if (!isUnique) {
        throw new Error(`Slug "${slug}" is already in use by another product.`);
      }
    }
    return this.repository.updateProduct(input);
  }
}
