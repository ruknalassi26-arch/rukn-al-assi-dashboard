"use client";
// ==============================================================================
// features/categories/presentation/pages/edit-category-page.tsx
// ==============================================================================
import { useParams } from "next/navigation";
import { CategoryForm } from "../components/category-form";
import { useCategory } from "@shared/hooks/categories/use-category-hooks";
import { Skeleton, Card, CardHeader, CardContent } from "@shared/ui";
import { ErrorState } from "@shared/components/error-state";

interface EditCategoryPageProps {
  categoryId?: string;
}

export function EditCategoryPage({ categoryId }: EditCategoryPageProps) {
  const params = useParams();
  const id = categoryId || (params?.id as string);
  const { data: category, isLoading, error, refetch } = useCategory(id);

  if (isLoading) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader><Skeleton className="h-8 w-64" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !category) {
    return (
      <ErrorState
        title="Category not found"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return <CategoryForm initialData={category} />;
}
