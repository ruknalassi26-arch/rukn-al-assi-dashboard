// ==============================================================================
// features/certificates/domain/usecases/update-certificate.usecase.ts
// ==============================================================================
import type { ICertificateRepository, UpdateCertificateInput } from "../repositories/i-certificate.repository";
import type { CertificateEntity } from "../entities/certificate.entity";

export class UpdateCertificateUseCase {
  constructor(private readonly repository: ICertificateRepository) {}

  async execute(input: UpdateCertificateInput): Promise<CertificateEntity> {
    return this.repository.updateCertificate(input);
  }
}
