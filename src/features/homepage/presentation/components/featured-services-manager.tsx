"use client";
// ==============================================================================
// features/homepage/presentation/components/featured-services-manager.tsx
// Management component for selecting & sorting Featured Services on homepage
// ==============================================================================
import { useState, useMemo } from "react";
import { Search, Star, Wrench, Check } from "lucide-react";
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
import { useFeaturedServices, useToggleFeaturedService } from "@shared/hooks/homepage/use-homepage-hooks";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";

export function FeaturedServicesManager() {
  const { data: services, isLoading, error, refetch } = useFeaturedServices();
  const toggleMutation = useToggleFeaturedService();
  const [search, setSearch] = useState("");

  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter(
      (s) =>
        s.titleEn.toLowerCase().includes(search.toLowerCase()) ||
        s.titleAr.includes(search)
    );
  }, [services, search]);

  const featuredCount = useMemo(
    () => services?.filter((s) => s.isFeatured).length ?? 0,
    [services]
  );

  const handleToggle = (id: string, currentStatus: boolean, sortOrder: number) => {
    toggleMutation.mutate({
      id,
      isFeatured: !currentStatus,
      sortOrder: currentStatus ? 0 : sortOrder || 1,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load services"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Featured Services</CardTitle>
            <Badge variant="outline" className="gap-1">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              {featuredCount} Featured
            </Badge>
          </div>
          <CardDescription>
            Select which existing services appear in the homepage Featured Services section.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {/* Services List */}
        {filteredServices.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No services found"
            description="Create services first in the Services module to feature them here."
          />
        ) : (
          <div className="space-y-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  service.isFeatured ? "border-amber-500/50 bg-amber-500/5" : "bg-card"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      service.isFeatured ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {service.titleEn}
                      </span>
                      {service.isFeatured && (
                        <Badge className="bg-amber-500 text-white gap-1 text-[10px]">
                          <Check className="h-3 w-3" /> Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate" dir="rtl">
                      {service.titleAr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-medium text-muted-foreground">
                    {service.isFeatured ? "Featured" : "Hidden"}
                  </span>
                  <Switch
                    checked={service.isFeatured}
                    onCheckedChange={() =>
                      handleToggle(service.id, service.isFeatured, service.sortOrder)
                    }
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
