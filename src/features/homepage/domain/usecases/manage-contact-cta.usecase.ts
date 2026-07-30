// ==============================================================================
// features/homepage/domain/usecases/manage-contact-cta.usecase.ts
// Use cases for Contact CTA section management
// ==============================================================================
import type { ContactCtaEntity } from "../entities/homepage.entity";
import type { IHomepageRepository } from "../repositories/i-homepage.repository";

export class GetContactCtaUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(): Promise<ContactCtaEntity | null> {
    return this.repo.getContactCta();
  }
}

export class UpdateContactCtaUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(data: Partial<ContactCtaEntity>): Promise<ContactCtaEntity> {
    const result = await this.repo.updateContactCta(data);
    await this.repo.logActivity("updated", "homepage", "Contact CTA Section Updated");
    return result;
  }
}
