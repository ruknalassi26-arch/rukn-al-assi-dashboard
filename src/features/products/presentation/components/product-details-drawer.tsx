"use client";
// ==============================================================================
// features/products/presentation/components/product-details-drawer.tsx
// Product Preview & Details Sheet Component strictly matching DB schema
// ==============================================================================
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Package, FileText, Edit, Calendar, Tag, Star, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Badge,
  Skeleton,
} from "@shared/ui";
import { useProductStore } from "../stores/product.store";
import { useProduct } from "@shared/hooks/products/use-product-hooks";

export function ProductDetailsDrawer() {
  const t = useTranslations("productsAdmin");
  const tCommon = useTranslations("common");
  const { drawerOpen, selectedProductId, closeDrawer } = useProductStore();
  const { data: product, isLoading } = useProduct(selectedProductId ?? "");

  if (!selectedProductId) return null;

  return (
    <Dialog open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5 text-primary" /> {t("title")}
            </DialogTitle>

            {product && (
              <Button asChild size="sm" variant="outline" className="gap-1 text-xs">
                <Link href={`/admin/products/edit/${product.id}`} onClick={closeDrawer}>
                  <Edit className="h-3.5 w-3.5" /> {tCommon("edit")}
                </Link>
              </Button>
            )}
          </div>
        </DialogHeader>

        {isLoading || !product ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {/* Gallery / Image Header */}
            <div className="relative h-64 w-full rounded-lg overflow-hidden bg-muted border flex items-center justify-center">
              {product.displayImage ? (
                <Image src={product.displayImage} alt={product.nameEn} fill className="object-cover" />
              ) : (
                <Package className="h-12 w-12 text-muted-foreground" />
              )}
              {product.isFeatured && (
                <Badge className="absolute top-3 right-3 bg-amber-500 text-white gap-1">
                  <Star className="h-3.5 w-3.5 fill-white" /> Featured
                </Badge>
              )}
            </div>

            {/* Title & Status & SKU */}
            <div className="space-y-2 border-b pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">{product.nameEn}</h2>
                <Badge variant={product.status === "published" ? "default" : "secondary"}>
                  {product.status}
                </Badge>
              </div>
              {product.sku && (
                <p className="text-xs font-mono bg-muted px-2 py-0.5 rounded w-max text-muted-foreground">
                  SKU: {product.sku}
                </p>
              )}
              {product.nameAr && (
                <p className="text-base text-muted-foreground font-arabic" dir="rtl">
                  {product.nameAr}
                </p>
              )}
              {product.nameKu && (
                <p className="text-sm text-muted-foreground font-arabic" dir="rtl">
                  ☀️ {product.nameKu}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" /> {product.category?.nameEn ?? "Uncategorized"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Created {product.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Short Summaries & Specifications */}
            <div className="space-y-4">
              {product.shortDescriptionEn && (
                <div className="space-y-1 border p-3 rounded-lg bg-muted/10">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Short Summary (EN)</h4>
                  <p className="text-sm">{product.shortDescriptionEn}</p>
                </div>
              )}
              {product.specificationsEn && (
                <div className="space-y-1 border p-3 rounded-lg bg-muted/10">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Specifications (EN)</h4>
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {JSON.stringify(product.specificationsEn, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Gallery Images List */}
            {product.allImages.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Gallery Assets ({product.allImages.length})</h4>
                <div className="grid grid-cols-4 gap-2">
                  {product.allImages.map((url, idx) => (
                    <div key={idx} className="relative h-20 rounded border overflow-hidden bg-muted">
                      <Image src={url} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Datasheet Link */}
            {product.datasheetUrl && (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5 border-primary/20">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <FileText className="h-5 w-5" /> Technical PDF Datasheet Document
                </div>
                <Button asChild size="sm" variant="outline" className="gap-1 text-xs">
                  <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer">
                    Download / View PDF <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
