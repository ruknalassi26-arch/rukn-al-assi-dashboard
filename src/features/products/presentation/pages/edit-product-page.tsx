"use client";
// ==============================================================================
// features/products/presentation/pages/edit-product-page.tsx
// ==============================================================================
import { useParams } from "next/navigation";
import { ProductForm } from "../components/product-form";
import { useProduct } from "@shared/hooks/products/use-product-hooks";
import { Skeleton, Card, CardHeader, CardContent } from "@shared/ui";
import { ErrorState } from "@shared/components/error-state";

interface EditProductPageProps {
  productId?: string;
}

export function EditProductPage({ productId }: EditProductPageProps) {
  const params = useParams();
  const id = productId || (params?.id as string);
  const { data: product, isLoading, error, refetch } = useProduct(id);

  if (isLoading) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader><Skeleton className="h-8 w-64" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !product) {
    return (
      <ErrorState
        title="Product not found"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return <ProductForm initialData={product} />;
}
