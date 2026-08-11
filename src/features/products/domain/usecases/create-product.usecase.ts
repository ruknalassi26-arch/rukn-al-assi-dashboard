// ==============================================================================
// features/products/domain/usecases/create-product.usecase.ts
// ==============================================================================
import type { IProductRepository, CreateProductInput } from "../repositories/i-product.repository";
import type { ProductEntity } from "../entities/product.entity";

export class CreateProductUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<ProductEntity> {
    const slug = input.translations?.en?.slug ?? Object.values(input.translations ?? {})[0]?.slug;
    if (slug) {
      const isUnique = await this.repository.checkSlugUnique(slug);
      if (!isUnique) {
        throw new Error(`Slug "${slug}" is already in use by another product.`);
      }
    }
    return this.repository.createProduct(input);
  }
}
