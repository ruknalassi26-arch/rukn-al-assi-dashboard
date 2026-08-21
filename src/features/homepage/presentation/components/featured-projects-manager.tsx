"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Search, Star, FolderKanban, Check } from "lucide-react";
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
import { useFeaturedProjects, useToggleFeaturedProject } from "@shared/hooks/homepage/use-homepage-hooks";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";

export function FeaturedProjectsManager() {
  const t = useTranslations("homepageAdmin");
  const tCommon = useTranslations("common");
  const { data: projects, isLoading, error, refetch } = useFeaturedProjects();
  const toggleMutation = useToggleFeaturedProject();
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(
      (p) =>
        p.titleEn.toLowerCase().includes(search.toLowerCase()) ||
        p.titleAr.includes(search)
    );
  }, [projects, search]);

  const featuredCount = useMemo(
    () => projects?.filter((p) => p.isFeatured).length ?? 0,
    [projects]
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
        title="Failed to load projects"
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
            <CardTitle>{t("featuredProjectsTitle")}</CardTitle>
            <Badge variant="outline" className="gap-1">
              <Star className="h-3 w-3 fill-violet-500 text-violet-500" />
              {featuredCount} {tCommon("featured")}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-2">
            <span>{t("featuredProjectsSubtitle")}</span>
            <span className="font-semibold text-primary">
              (Top 3 featured projects displayed on the public Home page)
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchProjects")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title={t("emptyProjectsTitle")}
            description={t("emptyProjectsDesc")}
          />
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  project.isFeatured ? "border-violet-500/50 bg-violet-500/5" : "bg-card"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted shrink-0 border">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.titleEn}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <FolderKanban className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {project.titleEn}
                      </span>
                      {project.isFeatured && (
                        <Badge className="bg-violet-600 text-white gap-1 text-[10px]">
                          <Check className="h-3 w-3" /> {tCommon("featured")}
                        </Badge>
                      )}
                      {project.isFeatured && (
                        <Badge variant="outline" className="text-[10px] text-violet-700 bg-violet-50 border-violet-300">
                          {filteredProjects.filter(p => p.isFeatured).findIndex(p => p.id === project.id) < 3
                            ? `Home Display #${filteredProjects.filter(p => p.isFeatured).findIndex(p => p.id === project.id) + 1}`
                            : "Queue"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate" dir="rtl">
                      {project.titleAr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-medium text-muted-foreground">
                    {project.isFeatured ? tCommon("featured") : tCommon("hidden")}
                  </span>
                  <Switch
                    checked={project.isFeatured}
                    onCheckedChange={() =>
                      handleToggle(project.id, project.isFeatured, project.sortOrder)
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
