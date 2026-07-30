// ==============================================================================
// features/certificates/domain/usecases/get-certificate-by-id.usecase.ts
// ==============================================================================
import type { ICertificateRepository } from "../repositories/i-certificate.repository";
import type { CertificateEntity } from "../entities/certificate.entity";

export class GetCertificateByIdUseCase {
  constructor(private readonly repository: ICertificateRepository) {}

  async execute(id: string): Promise<CertificateEntity | null> {
    return this.repository.getCertificateById(id);
  }
}
