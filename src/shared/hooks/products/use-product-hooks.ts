"use client";
// ==============================================================================
// shared/hooks/products/use-product-hooks.ts
// TanStack Query Hooks for Products Management Feature
// ==============================================================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@core/constants/query-keys";
import { SupabaseProductRepository } from "@features/products/data/repositories/supabase-product.repository";
import {
  GetProductsUseCase,
  GetProductByIdUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
  DuplicateProductUseCase,
  ToggleFeatureProductUseCase,
  BulkDeleteProductsUseCase,
  BulkUpdateProductStatusUseCase,
  GetProductCategoriesUseCase,
} from "@features/products/domain/usecases";
import type { ProductFilterParams, CreateProductInput, UpdateProductInput } from "@features/products/domain/repositories/i-product.repository";
import type { ProductStatus } from "@features/products/domain/entities/product.entity";

const repository = new SupabaseProductRepository();
const getProductsUseCase = new GetProductsUseCase(repository);
const getProductByIdUseCase = new GetProductByIdUseCase(repository);
const createProductUseCase = new CreateProductUseCase(repository);
const updateProductUseCase = new UpdateProductUseCase(repository);
const deleteProductUseCase = new DeleteProductUseCase(repository);
const duplicateProductUseCase = new DuplicateProductUseCase(repository);
const toggleFeatureProductUseCase = new ToggleFeatureProductUseCase(repository);
const bulkDeleteProductsUseCase = new BulkDeleteProductsUseCase(repository);
const bulkUpdateProductStatusUseCase = new BulkUpdateProductStatusUseCase(repository);
const getProductCategoriesUseCase = new GetProductCategoriesUseCase(repository);

export function useProducts(params?: ProductFilterParams) {
  return useQuery({
    queryKey: queryKeys.products.list((params ?? {}) as Record<string, unknown>),
    queryFn: () => getProductsUseCase.execute(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProductByIdUseCase.execute(id),
    enabled: !!id,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: () => getProductCategoriesUseCase.execute(),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) => createProductUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success("Product created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product");
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProductInput) => updateProductUseCase.execute(input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(updated.id) });
      toast.success("Product updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success("Product deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });
}

export function useDuplicateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => duplicateProductUseCase.execute(id),
    onMutate: () => {
      const toastId = toast.loading("Duplicating product...");
      return { toastId };
    },
    onSuccess: (duplicated, _variables, context) => {
      if (context?.toastId) toast.dismiss(context.toastId);
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success(`Duplicated product "${duplicated.nameEn}" successfully`);
    },
    onError: (error: Error, _variables, context) => {
      if (context?.toastId) toast.dismiss(context.toastId);
      toast.error(error.message || "Failed to duplicate product");
    },
  });
}

export function useToggleFeatureProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      toggleFeatureProductUseCase.execute(id, isFeatured),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success(
        updated.isFeatured
          ? `Product "${updated.nameEn}" set as Featured`
          : `Product "${updated.nameEn}" unfeatured`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to toggle feature status");
    },
  });
}

export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteProductsUseCase.execute(ids),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success(`Deleted ${ids.length} products`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk delete products");
    },
  });
}

export function useBulkUpdateProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: ProductStatus }) =>
      bulkUpdateProductStatusUseCase.execute(ids, status),
    onSuccess: (_, { ids, status }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success(`Updated status to "${status}" for ${ids.length} products`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to bulk update status");
    },
  });
}
