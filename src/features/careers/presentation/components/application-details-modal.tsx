"use client";
// ==============================================================================
// features/careers/presentation/components/application-details-modal.tsx
// Dialog modal displaying applicant details, cover message, CV download, and status updater
// ==============================================================================
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Download, FileText, Mail, Phone, Calendar, User, Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@shared/ui";
import { useUpdateCareerApplicationStatus } from "@shared/hooks/careers/use-career-hooks";
import type { CareerApplicationEntity } from "../../domain/entities/career.entity";
import type { ApplicationStatus } from "../../domain/enums/career.enum";

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: CareerApplicationEntity | null;
}

export function ApplicationDetailsModal({
  isOpen,
  onClose,
  application,
}: ApplicationDetailsModalProps) {
  const t = useTranslations("careersAdmin");
  const tCommon = useTranslations("common");

  const updateStatusMutation = useUpdateCareerApplicationStatus();

  const [status, setStatus] = useState<ApplicationStatus>("new");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (application) {
      setStatus(application.status);
      setNotes(application.notes ?? "");
    }
  }, [application]);

  if (!application) return null;

  const handleStatusSave = async () => {
    await updateStatusMutation.mutateAsync({
      id: application.id,
      status,
      notes,
    });
    onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle>{t("details.modalTitle")}</DialogTitle>
            {getStatusBadge(application.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Main Info Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/10">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> {t("table.applicant")}
              </span>
              <p className="font-semibold text-sm">{application.applicantName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" /> {t("table.position")}
              </span>
              <p className="font-semibold text-sm">{application.jobTitle || "General Application"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {t("table.email")}
              </span>
              <p className="text-sm">
                <a href={`mailto:${application.email}`} className="text-primary hover:underline">
                  {application.email}
                </a>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {t("table.phone")}
              </span>
              <p className="text-sm">
                <a href={`tel:${application.phone}`} className="text-primary hover:underline">
                  {application.phone}
                </a>
              </p>
            </div>

            <div className="space-y-1 sm:col-span-2 pt-2 border-t">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {t("table.submittedDate")}
              </span>
              <p className="text-xs">{new Date(application.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Download CV File */}
          <div className="flex items-center justify-between border p-3 rounded-lg bg-emerald-500/5 border-emerald-500/20">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-medium">{application.cvFileName || "Resume_CV.pdf"}</p>
                <p className="text-xs text-muted-foreground">Uploaded candidate CV document</p>
              </div>
            </div>

            <Button asChild size="sm" variant="outline" className="gap-2 border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
              <a href={application.cvFileUrl} target="_blank" rel="noopener noreferrer" download>
                <Download className="h-4 w-4" />
                {t("details.downloadCv")}
              </a>
            </Button>
          </div>

          {/* Cover Message */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t("details.coverMessage")}</Label>
            <div className="p-3 rounded-md border bg-muted/20 text-sm whitespace-pre-wrap leading-relaxed min-h-[80px]">
              {application.coverMessage ? application.coverMessage : <span className="text-muted-foreground italic">No cover letter submitted.</span>}
            </div>
          </div>

          {/* Status Update & Notes Form */}
          <div className="space-y-4 pt-3 border-t">
            <div className="space-y-1.5">
              <Label>{t("details.updateStatus")}</Label>
              <Select value={status} onValueChange={(val: ApplicationStatus) => setStatus(val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{t("appStatus.new")}</SelectItem>
                  <SelectItem value="reviewed">{t("appStatus.reviewed")}</SelectItem>
                  <SelectItem value="shortlisted">{t("appStatus.shortlisted")}</SelectItem>
                  <SelectItem value="hired">{t("appStatus.hired")}</SelectItem>
                  <SelectItem value="rejected">{t("appStatus.rejected")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t("details.notesLabel")}</Label>
              <Textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private evaluation notes for HR team..."
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {tCommon("cancel")}
          </Button>
          <Button type="button" onClick={handleStatusSave} disabled={updateStatusMutation.isPending}>
            {tCommon("saveChanges")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
