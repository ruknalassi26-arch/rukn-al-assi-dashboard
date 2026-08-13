"use client";
// ==============================================================================
// app/[locale]/(admin)/admin/homepage/hero/create/page.tsx
// Dedicated Create Hero Slide Page
// ==============================================================================
import { useRouter } from "next/navigation";
import { HeroSlideForm, HeroSlideFormValues } from "@shared/forms/hero-slide-form";
import { useCreateHeroSlide } from "@shared/hooks/homepage/use-homepage-hooks";

export default function CreateHeroSlidePage() {
  const router = useRouter();
  const createMutation = useCreateHeroSlide();

  const handleSubmit = async (values: HeroSlideFormValues) => {
    await createMutation.mutateAsync({
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
    } as any);

    router.push("/admin/homepage");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <HeroSlideForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        isEditing={false}
      />
    </div>
  );
}
