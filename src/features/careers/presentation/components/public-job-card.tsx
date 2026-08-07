"use client";
// ==============================================================================
// features/careers/presentation/components/public-job-card.tsx
// Responsive Client Website Job Opportunity Card Component
// ==============================================================================
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Building, Calendar, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@shared/ui";
import type { JobPostingEntity } from "../../domain/entities/career.entity";
import type { EmploymentType } from "../../domain/enums/career.enum";

interface PublicJobCardProps {
  job: JobPostingEntity;
}

export function PublicJobCard({ job }: PublicJobCardProps) {
  const locale = useLocale();
  const t = useTranslations("careersPublic");
  const tAdmin = useTranslations("careersAdmin");

  const getTitle = () => {
    if (locale === "ar") return job.titleAr || job.titleEn;
    if (locale === "ckb") return job.titleKu || job.titleEn;
    return job.titleEn;
  };

  const getDescription = () => {
    if (locale === "ar") return job.descriptionAr || job.descriptionEn;
    if (locale === "ckb") return job.descriptionKu || job.descriptionEn;
    return job.descriptionEn;
  };

  const getEmploymentTypeBadge = (type: EmploymentType) => {
    switch (type) {
      case "full_time":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30">{tAdmin("types.full_time")}</Badge>;
      case "part_time":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30">{tAdmin("types.part_time")}</Badge>;
      case "contract":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">{tAdmin("types.contract")}</Badge>;
      case "internship":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">{tAdmin("types.internship")}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const desc = getDescription();
  const shortDesc = desc ? (desc.length > 180 ? `${desc.substring(0, 180)}...` : desc) : "";

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-all duration-300 border-muted/80">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
            {getTitle()}
          </CardTitle>
          {getEmploymentTypeBadge(job.employmentType)}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
          {job.department && (
            <span className="flex items-center gap-1">
              <Building className="h-3.5 w-3.5 text-primary shrink-0" />
              {job.department}
            </span>
          )}
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              {job.location}
            </span>
          )}
          {job.closingDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
              {t("closingOn")} {new Date(job.closingDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {shortDesc || "Join our team to contribute your skills to high-impact hydraulic engineering projects."}
        </p>
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <Button asChild className="w-full gap-2 group">
          <Link href={`/${locale}/careers/${job.slug}`}>
            {t("applyNow")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
