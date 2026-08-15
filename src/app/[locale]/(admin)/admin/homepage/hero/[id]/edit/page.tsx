"use client";
// ==============================================================================
// app/[locale]/(admin)/admin/homepage/hero/[id]/edit/page.tsx
// Dedicated Edit Hero Slide Page
// ==============================================================================
import { use } from "react";
import { useRouter } from "next/navigation";
import { HeroSlideForm, HeroSlideFormValues } from "@shared/forms/hero-slide-form";
import { useHeroSlideById, useUpdateHeroSlide } from "@shared/hooks/homepage/use-homepage-hooks";
import { Skeleton, Card, CardHeader, CardContent } from "@shared/ui";
import { ErrorState } from "@shared/components/error-state";
import type { HeroSlideEntity } from "@features/homepage/domain/entities/homepage.entity";

interface EditHeroSlidePageProps {
  params: Promise<{ id: string }>;
}

export default function EditHeroSlidePage({ params }: EditHeroSlidePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: slide, isLoading, error, refetch } = useHeroSlideById(id);
  const updateMutation = useUpdateHeroSlide();

  const handleSubmit = async (values: HeroSlideFormValues) => {
    await updateMutation.mutateAsync({
      id,
      slide: {
        titleEn: values.titleEn,
        titleAr: values.titleAr,
        titleKu: values.titleKu ?? null,
        subtitleEn: values.subtitleEn ?? null,
        subtitleAr: values.subtitleAr ?? null,
        subtitleKu: values.subtitleKu ?? null,
        bodyEn: values.bodyEn ?? null,
        bodyAr: values.bodyAr ?? null,
        bodyKu: values.bodyKu ?? null,
        primaryButtonTextEn: values.primaryButtonTextEn ?? null,
        primaryButtonTextAr: values.primaryButtonTextAr ?? null,
        primaryButtonTextKu: values.primaryButtonTextKu ?? null,
        primaryButtonUrl: values.primaryButtonUrl ?? null,
        backgroundImage: values.backgroundImage,
        overlayOpacity: values.overlayOpacity,
        status: values.status,
        sortOrder: values.sortOrder,
      } as Partial<HeroSlideEntity>,
    });

    router.push("/admin/homepage");
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-10 w-64" />
        <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (error || !slide) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <ErrorState
          title="Failed to load Hero slide"
          error={error ?? new Error("Hero slide not found")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <HeroSlideForm
        initialValues={slide}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        isEditing={true}
      />
    </div>
  );
}
