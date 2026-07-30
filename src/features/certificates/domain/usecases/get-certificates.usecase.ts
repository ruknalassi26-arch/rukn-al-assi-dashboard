// ==============================================================================
// features/certificates/domain/usecases/get-certificates.usecase.ts
// ==============================================================================
import type { ICertificateRepository, CertificateFilterParams, PaginatedCertificates } from "../repositories/i-certificate.repository";

export class GetCertificatesUseCase {
  constructor(private readonly repository: ICertificateRepository) {}

  async execute(params?: CertificateFilterParams): Promise<PaginatedCertificates> {
    return this.repository.getCertificates(params);
  }
}
