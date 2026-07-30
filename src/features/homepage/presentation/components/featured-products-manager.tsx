"use client";
// ==============================================================================
// features/homepage/presentation/components/featured-products-manager.tsx
// Manager for toggling featured products on Homepage
// ==============================================================================
import { useState, useMemo } from "react";
import Image from "next/image";
import { Package, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Switch,
  Badge,
  Skeleton,
} from "@shared/ui";
import { useFeaturedProducts, useToggleFeaturedProduct } from "@shared/hooks/homepage/use-homepage-hooks";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";

export function FeaturedProductsManager() {
  const { data: products, isLoading, error, refetch } = useFeaturedProducts();
  const toggleMutation = useToggleFeaturedProduct();
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(
      (p) =>
        p.titleEn.toLowerCase().includes(search.toLowerCase()) ||
        p.titleAr.includes(search)
    );
  }, [products, search]);

  const handleToggle = async (id: string, currentStatus: boolean, sortOrder: number) => {
    await toggleMutation.mutateAsync({ id, isFeatured: !currentStatus, sortOrder });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load products" error={error} onRetry={() => refetch()} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Products</CardTitle>
        <CardDescription>
          Toggle which catalog products appear on the homepage featured carousel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products found"
            description="Create products first in the Products module to feature them here."
          />
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  prod.isFeatured ? "border-purple-500/50 bg-purple-500/5" : "bg-card"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted shrink-0 border flex items-center justify-center">
                    {prod.image ? (
                      <Image src={prod.image} alt={prod.titleEn} fill className="object-cover" />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground truncate">{prod.titleEn}</span>
                      <Badge variant={prod.isFeatured ? "default" : "secondary"}>
                        {prod.isFeatured ? "Featured" : "Standard"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate" dir="rtl">{prod.titleAr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-medium text-muted-foreground">
                    {prod.isFeatured ? "Featured" : "Hidden"}
                  </span>
                  <Switch
                    checked={prod.isFeatured}
                    onCheckedChange={() => handleToggle(prod.id, prod.isFeatured, prod.sortOrder)}
                    disabled={toggleMutation.isPending}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
