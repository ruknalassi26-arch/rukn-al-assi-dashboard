// ==============================================================================
// features/contact/domain/usecases/get-contact-info.usecase.ts
// ==============================================================================
import type { IContactRepository } from "../repositories/i-contact.repository";
import type { ContactInfoEntity } from "../entities/contact-info.entity";

export class GetContactInfoUseCase {
  constructor(private readonly repository: IContactRepository) {}

  async execute(): Promise<ContactInfoEntity | null> {
    return this.repository.getContactInfo();
  }
}
