// ==============================================================================
// features/certificates/domain/usecases/delete-certificate.usecase.ts
// ==============================================================================
import type { ICertificateRepository } from "../repositories/i-certificate.repository";

export class DeleteCertificateUseCase {
  constructor(private readonly repository: ICertificateRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteCertificate(id);
  }
}
