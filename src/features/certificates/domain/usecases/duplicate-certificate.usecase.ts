// ==============================================================================
// features/certificates/domain/usecases/duplicate-certificate.usecase.ts
// ==============================================================================
import type { ICertificateRepository } from "../repositories/i-certificate.repository";
import type { CertificateEntity } from "../entities/certificate.entity";

export class DuplicateCertificateUseCase {
  constructor(private readonly repository: ICertificateRepository) {}

  async execute(id: string): Promise<CertificateEntity> {
    return this.repository.duplicateCertificate(id);
  }
}
