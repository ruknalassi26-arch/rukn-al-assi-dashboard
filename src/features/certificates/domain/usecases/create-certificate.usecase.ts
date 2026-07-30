// ==============================================================================
// features/certificates/domain/usecases/create-certificate.usecase.ts
// ==============================================================================
import type { ICertificateRepository, CreateCertificateInput } from "../repositories/i-certificate.repository";
import type { CertificateEntity } from "../entities/certificate.entity";

export class CreateCertificateUseCase {
  constructor(private readonly repository: ICertificateRepository) {}

  async execute(input: CreateCertificateInput): Promise<CertificateEntity> {
    return this.repository.createCertificate(input);
  }
}
