"use client";
// ==============================================================================
// features/certificates/presentation/pages/edit-certificate-page.tsx
// ==============================================================================
import { useParams } from "next/navigation";
import { CertificateForm } from "../components/certificate-form";
import { useCertificate } from "@shared/hooks/certificates/use-certificate-hooks";
import { Skeleton, Card, CardHeader, CardContent } from "@shared/ui";
import { ErrorState } from "@shared/components/error-state";

interface EditCertificatePageProps {
  certificateId?: string;
}

export function EditCertificatePage({ certificateId }: EditCertificatePageProps) {
  const params = useParams();
  const id = certificateId || (params?.id as string);
  const { data: certificate, isLoading, error, refetch } = useCertificate(id);

  if (isLoading) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader><Skeleton className="h-8 w-64" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !certificate) {
    return (
      <ErrorState
        title="Certificate not found"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <CertificateForm
      key={`${certificate.id}-${certificate.issueDate ?? ""}`}
      initialData={certificate}
    />
  );
}
