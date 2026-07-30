// ==============================================================================
// features/contact/domain/usecases/update-contact-info.usecase.ts
// ==============================================================================
import type { IContactRepository, UpdateContactInfoInput } from "../repositories/i-contact.repository";
import type { ContactInfoEntity } from "../entities/contact-info.entity";

export class UpdateContactInfoUseCase {
  constructor(private readonly repository: IContactRepository) {}

  async execute(input: UpdateContactInfoInput): Promise<ContactInfoEntity> {
    return this.repository.updateContactInfo(input);
  }
}
