"use client";
// ==============================================================================
// features/vacation/presentation/components/admin/employee-detail-dialog.tsx
// Dialog showing Employee Profile, Vacation History, Pending Requests & Action with i18n
// ==============================================================================
import { useState } from "react";
import {
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
} from "@shared/ui";
import { useTranslations } from "next-intl";
import type { EmployeeProfileEntity } from "../../../domain/entities/employee.entity";
import type { VacationRequestEntity } from "../../../domain/entities/vacation.entity";
import { useAdminVacationRequests } from "../../hooks/use-vacation";
import { AdminCreateVacationDialog } from "./admin-create-vacation-dialog";

interface EmployeeDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeProfileEntity | null;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function EmployeeDetailDialog({
  isOpen,
  onClose,
  employee,
}: EmployeeDetailDialogProps) {
  const t = useTranslations("employees");
  const tVac = useTranslations("vacation");
  const [isAddVacationOpen, setIsAddVacationOpen] = useState(false);

  const { data: requests = [], isLoading: isLoadingRequests } = useAdminVacationRequests(
    undefined,
    employee?.id,
    isOpen && !!employee?.id
  );

  if (!employee) return null;

  const pendingRequests = requests.filter((r: VacationRequestEntity) => r.status === "pending");
  const approvedRequests = requests.filter((r: VacationRequestEntity) => r.status === "approved");

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                  {employee.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <DialogTitle className="text-base font-bold flex items-center gap-2">
                    {employee.fullName}
                    <Badge variant={employee.isActive ? "default" : "secondary"} className="text-[10px]">
                      {employee.isActive ? t("active") : t("inactive")}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    {employee.jobTitle || "Employee"} &bull; {employee.department || "General"}
                  </DialogDescription>
                </div>
              </div>

              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => setIsAddVacationOpen(true)}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                {t("dialog.addVacation")}
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="profile" className="flex-1 flex flex-col min-h-0 pt-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="profile" className="text-xs">{t("dialog.profileDetails")}</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">
                {t("dialog.pendingRequests")} ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs">
                {t("dialog.vacationHistory")} ({requests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="flex-1 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3.5 rounded-lg border text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("dialog.email")}:</span>
                  <span className="font-medium">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("dialog.phone")}:</span>
                  <span className="font-medium">{employee.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("dialog.department")}:</span>
                  <span className="font-medium">{employee.department || "General"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("dialog.jobTitle")}:</span>
                  <span className="font-medium">{employee.jobTitle || "Employee"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("dialog.startDate")}:</span>
                  <span className="font-medium">
                    {formatDate(employee.employmentStartDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("dialog.registered")}:</span>
                  <span className="font-medium">
                    {formatDate(employee.createdAt)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-lg p-3 bg-card shadow-sm text-center">
                  <span className="text-xs text-muted-foreground">{t("dialog.approvedLeaves")}</span>
                  <p className="text-xl font-bold text-primary mt-1">{approvedRequests.length}</p>
                </div>
                <div className="border rounded-lg p-3 bg-card shadow-sm text-center">
                  <span className="text-xs text-muted-foreground">{t("dialog.pendingApproval")}</span>
                  <p className="text-xl font-bold text-amber-500 mt-1">{pendingRequests.length}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pending" className="flex-1 min-h-0 pt-2">
              <ScrollArea className="h-[260px] pr-2">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">
                    {t("dialog.noPendingRequests")}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingRequests.map((req: VacationRequestEntity) => {
                      const typeName =
                        typeof req.vacationType === "object"
                          ? req.vacationType?.name
                          : req.vacationType || "Vacation";
                      return (
                        <div key={req.id} className="p-3 border rounded-lg bg-card text-xs flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2 font-semibold">
                              <span>{typeName}</span>
                              <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30 bg-amber-500/10">
                                {tVac("tabs.pending")}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mt-0.5">
                              {formatDate(req.fromDate)} &rarr; {formatDate(req.toDate)} ({req.requestedDays} {tVac("review.days")})
                            </p>
                            {req.note && <p className="text-muted-foreground italic mt-0.5">&ldquo;{req.note}&rdquo;</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="history" className="flex-1 min-h-0 pt-2">
              <ScrollArea className="h-[260px] pr-2">
                {isLoadingRequests ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">Loading...</div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">{t("dialog.noHistoryFound")}</div>
                ) : (
                  <div className="space-y-2">
                    {requests.map((req: VacationRequestEntity) => {
                      const typeName =
                        typeof req.vacationType === "object"
                          ? req.vacationType?.name
                          : req.vacationType || "Vacation";
                      return (
                        <div key={req.id} className="p-3 border rounded-lg bg-card text-xs flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2 font-semibold">
                              <span>{typeName}</span>
                              <Badge
                                variant={
                                  req.status === "approved"
                                    ? "default"
                                    : req.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="text-[10px] capitalize"
                              >
                                {req.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mt-0.5">
                              {formatDate(req.fromDate)} &rarr; {formatDate(req.toDate)} ({req.requestedDays} {tVac("review.days")})
                            </p>
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {formatDate(req.createdAt)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Vacation on Behalf Modal */}
      <AdminCreateVacationDialog
        isOpen={isAddVacationOpen}
        onClose={() => setIsAddVacationOpen(false)}
        initialEmployeeId={employee.id}
      />
    </>
  );
}
