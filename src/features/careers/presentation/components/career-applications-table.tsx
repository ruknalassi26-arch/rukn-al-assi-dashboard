"use client";
// ==============================================================================
// features/careers/presentation/components/career-applications-table.tsx
// Professional Data Table for Candidate Career Applications
// ==============================================================================
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Download,
  Eye,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Mail,
  Phone,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Skeleton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui";
import {
  useCareerApplications,
  useDeleteCareerApplication,
} from "@shared/hooks/careers/use-career-hooks";
import { ApplicationDetailsModal } from "./application-details-modal";
import type { CareerApplicationEntity } from "../../domain/entities/career.entity";
import type { ApplicationStatus } from "../../domain/enums/career.enum";

export function CareerApplicationsTable() {
  const t = useTranslations("careersAdmin");
  const tCommon = useTranslations("common");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useCareerApplications({
    search,
    status: statusFilter,
    limit,
    offset: (page - 1) * limit,
  });

  const deleteMutation = useDeleteCareerApplication();

  const [selectedApp, setSelectedApp] = useState<CareerApplicationEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteMutation.mutateAsync(deletingId);
    setDeletingId(null);
  };

  const getStatusBadge = (st: ApplicationStatus) => {
    switch (st) {
      case "new":
        return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">{t("appStatus.new")}</Badge>;
      case "reviewed":
        return <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30">{t("appStatus.reviewed")}</Badge>;
      case "shortlisted":
        return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">{t("appStatus.shortlisted")}</Badge>;
      case "hired":
        return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">{t("appStatus.hired")}</Badge>;
      case "rejected":
        return <Badge variant="destructive">{t("appStatus.rejected")}</Badge>;
      default:
        return <Badge variant="outline">{st}</Badge>;
    }
  };

  const totalPages = Math.ceil((data?.total ?? 0) / limit);

  return (
    <div className="space-y-4">
      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`${tCommon("search")}...`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(val: ApplicationStatus | "all") => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={tCommon("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tCommon("all")}</SelectItem>
              <SelectItem value="new">{t("appStatus.new")}</SelectItem>
              <SelectItem value="reviewed">{t("appStatus.reviewed")}</SelectItem>
              <SelectItem value="shortlisted">{t("appStatus.shortlisted")}</SelectItem>
              <SelectItem value="hired">{t("appStatus.hired")}</SelectItem>
              <SelectItem value="rejected">{t("appStatus.rejected")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Applications Table */}
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("table.applicant")}</TableHead>
              <TableHead>{t("table.email")}</TableHead>
              <TableHead>{t("table.phone")}</TableHead>
              <TableHead>{t("table.position")}</TableHead>
              <TableHead>{t("table.cv")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.submittedDate")}</TableHead>
              <TableHead className="text-end">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-destructive">
                  Failed to load applications. <Button variant="link" onClick={() => refetch()}>Try Again</Button>
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="h-10 w-10 text-muted-foreground/50" />
                    <p className="font-medium text-base">{t("emptyAppsTitle")}</p>
                    <p className="text-xs">{t("emptyAppsDescription")}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((app) => (
                <TableRow key={app.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold text-foreground">
                    {app.applicantName}
                  </TableCell>
                  <TableCell>
                    <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span>{app.email}</span>
                    </a>
                  </TableCell>
                  <TableCell>
                    <a href={`tel:${app.phone}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>{app.phone}</span>
                    </a>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground">
                    {app.jobTitle || tCommon("generalApplication")}
                  </TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="ghost" className="h-7 gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                      <a href={app.cvFileUrl} target="_blank" rel="noopener noreferrer" download>
                        <Download className="h-3.5 w-3.5" /> CV
                      </a>
                    </Button>
                  </TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedApp(app)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={app.cvFileUrl} target="_blank" rel="noopener noreferrer" download>
                            <Download className="mr-2 h-4 w-4" /> Download CV
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingId(app.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> {tCommon("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            {tCommon("showing")} {data?.data.length} {tCommon("of")} {data?.total} {tCommon("items")}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium">
              {tCommon("page")} {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Details & Status Modal */}
      <ApplicationDetailsModal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        application={selectedApp}
      />

      {/* Confirm Delete Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open: boolean) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. It will permanently remove this candidate application and CV record.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>
              {tCommon("cancel")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {tCommon("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
