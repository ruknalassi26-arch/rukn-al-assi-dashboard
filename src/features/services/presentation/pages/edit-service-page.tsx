"use client";
// ==============================================================================
// features/services/presentation/pages/edit-service-page.tsx
// ==============================================================================
import { ServiceForm } from "../components/service-form";
import { useService } from "@shared/hooks/services/use-service-hooks";
import { Skeleton, Card, CardHeader, CardContent } from "@shared/ui";
import { ErrorState } from "@shared/components/error-state";

interface EditServicePageProps {
  serviceId: string;
}

export function EditServicePage({ serviceId }: EditServicePageProps) {
  const { data: service, isLoading, error, refetch } = useService(serviceId);

  if (isLoading) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader><Skeleton className="h-8 w-64" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !service) {
    return (
      <ErrorState
        title="Service not found"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return <ServiceForm initialData={service} />;
}
