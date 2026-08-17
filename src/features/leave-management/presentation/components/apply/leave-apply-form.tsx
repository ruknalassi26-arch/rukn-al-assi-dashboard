"use client";
// ==============================================================================
// features/leave-management/presentation/components/apply/leave-apply-form.tsx
// Dedicated form for employee leave application
// ==============================================================================

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@shared/ui";
import {
  CalendarDays,
  Send,
  Loader2,
  Info,
  Clock,
  Calendar,
  UserCheck,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  useActiveLeaveTypes,
  useActiveLeavePolicies,
  useActiveEmployees,
  useCurrentEmployeeId,
  useCreateLeaveRequest,
  useMyLeaveDashboard,
} from "../../hooks/use-leave";
import { NoEmployeeProfileAlert } from "../shared/no-employee-profile-alert";
import type { LeaveTypeEntity } from "../../../domain/entities";

const formSchema = z
  .object({
    leaveTypeId: z.string().min(1, "Please select a leave type"),
    requestedDays: z.number().nullable().optional(),
    requestedHours: z.number().nullable().optional(),
    fromDate: z.string().min(1, "Start date is required"),
    toDate: z.string().min(1, "End date is required"),
    returnToWorkDate: z.string().min(1, "Return to work date is required"),
    alternativeEmployeeId: z.string().nullable().optional(),
    note: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.fromDate && data.toDate) {
        return new Date(data.toDate) >= new Date(data.fromDate);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["toDate"],
    }
  )
  .refine(
    (data) => {
      if (data.toDate && data.returnToWorkDate) {
        return new Date(data.returnToWorkDate) >= new Date(data.toDate);
      }
      return true;
    },
    {
      message: "Return to work date must be on or after end date",
      path: ["returnToWorkDate"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

export function LeaveApplyForm() {
  const router = useRouter();
  const locale = useLocale();

  const { error: dashboardError } = useMyLeaveDashboard();
  const { data: leaveTypes = [], isLoading: isLoadingTypes } = useActiveLeaveTypes();
  const { data: policies = [], isLoading: isLoadingPolicies } = useActiveLeavePolicies();
  const { data: employees = [], isLoading: isLoadingEmployees } = useActiveEmployees();
  const { data: currentEmployeeId } = useCurrentEmployeeId();

  const createMutation = useCreateLeaveRequest();

  const [selectedType, setSelectedType] = useState<LeaveTypeEntity | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaveTypeId: "",
      requestedDays: 1,
      requestedHours: null,
      fromDate: "",
      toDate: "",
      returnToWorkDate: "",
      alternativeEmployeeId: "",
      note: "",
    },
  });

  const leaveTypeIdValue = watch("leaveTypeId");
  const alternativeEmployeeIdValue = watch("alternativeEmployeeId");
  const fromDateValue = watch("fromDate");
  const toDateValue = watch("toDate");

  // Select first leave type automatically when loaded
  useEffect(() => {
    if (leaveTypes.length > 0 && !leaveTypeIdValue) {
      const first = leaveTypes[0];
      setValue("leaveTypeId", first.id);
      setSelectedType(first);
      if (first.unit === "hour") {
        setValue("requestedHours", 4);
        setValue("requestedDays", null);
      } else {
        setValue("requestedDays", 1);
        setValue("requestedHours", null);
      }
    }
  }, [leaveTypes, leaveTypeIdValue, setValue]);

  // When leave type changes, update selectedType and reset unit values
  const handleTypeChange = (id: string) => {
    const found = leaveTypes.find((t) => t.id === id);
    setSelectedType(found || null);
    setValue("leaveTypeId", id, { shouldValidate: true });

    if (found?.unit === "hour") {
      setValue("requestedHours", 4);
      setValue("requestedDays", null);
    } else {
      setValue("requestedDays", 1);
      setValue("requestedHours", null);
    }
  };

  // Associated policy for selected leave type
  const associatedPolicy = useMemo(() => {
    if (!selectedType) return null;
    return policies.find((p) => p.leaveTypeId === selectedType.id);
  }, [policies, selectedType]);

  // Filter out current employee from alternative employee list
  const availableAlternatives = useMemo(() => {
    return employees.filter((emp) => emp.id !== currentEmployeeId);
  }, [employees, currentEmployeeId]);

  // Auto-suggest requested days based on date difference for day unit
  useEffect(() => {
    if (selectedType?.unit === "day" && fromDateValue && toDateValue) {
      const from = new Date(fromDateValue);
      const to = new Date(toDateValue);
      if (to >= from) {
        const diffDays = Math.round((to.getTime() - from.getTime()) / (1000 * 3600 * 24)) + 1;
        setValue("requestedDays", Math.max(1, diffDays), { shouldValidate: true });
      }
    }
  }, [fromDateValue, toDateValue, selectedType, setValue]);

  const onSubmit = async (values: FormValues) => {
    const unit = selectedType?.unit === "hour" ? "hour" : "day";

    await createMutation.mutateAsync({
      leaveTypeId: values.leaveTypeId,
      alternativeEmployeeId: values.alternativeEmployeeId || null,
      requestUnit: unit,
      requestedDays: unit === "day" ? Number(values.requestedDays || 1) : null,
      requestedHours: unit === "hour" ? Number(values.requestedHours || 1) : null,
      fromDate: values.fromDate,
      toDate: values.toDate,
      returnToWorkDate: values.returnToWorkDate,
      note: values.note || null,
    });

    router.push(`/${locale}/admin/leave/history`);
  };

  const isProfileMissing =
    dashboardError &&
    (dashboardError.message.toLowerCase().includes("employee profile not found") ||
      dashboardError.message.toLowerCase().includes("profile not found") ||
      dashboardError.message.toLowerCase().includes("no employee"));

  if (isProfileMissing) {
    return <NoEmployeeProfileAlert message={dashboardError.message} />;
  }

  const isPageLoading = isLoadingTypes || isLoadingPolicies || isLoadingEmployees;

  if (isPageLoading) {
    return (
      <Card className="max-w-3xl mx-auto shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-sm border overflow-hidden">
      <CardHeader className="bg-muted/20 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Apply for Leave</CardTitle>
            <CardDescription>
              Submit a formal request for paid time off, hourly absence, or sick leave.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="p-6 space-y-6">
          {/* Leave Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="leaveTypeId" className="font-semibold flex items-center gap-1.5">
              <span>Leave Type</span>
              <span className="text-destructive">*</span>
            </Label>
            <Select value={leaveTypeIdValue} onValueChange={handleTypeChange}>
              <SelectTrigger id="leaveTypeId" className="w-full h-10">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{type.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        ({type.unit === "hour" ? "Hourly" : "Full Day"})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.leaveTypeId && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.leaveTypeId.message}
              </p>
            )}
          </div>

          {/* Policy Information Box */}
          {associatedPolicy && (
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/15 text-xs text-primary space-y-1 flex items-start gap-2.5">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Company Leave Policy</p>
                <p className="text-muted-foreground">
                  Entitlement: <strong className="text-foreground">{associatedPolicy.allocationAmount} {associatedPolicy.allocationUnit}s</strong> every {associatedPolicy.periodMonths} months.
                  {associatedPolicy.hoursPerDay && ` Standard workday: ${associatedPolicy.hoursPerDay} hours/day.`}
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Days vs Hours Input */}
          {selectedType?.unit === "hour" ? (
            <div className="space-y-1.5">
              <Label htmlFor="requestedHours" className="font-semibold flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Requested Hours</span>
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="requestedHours"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                placeholder="e.g. 4"
                {...register("requestedHours", { valueAsNumber: true })}
              />
              <p className="text-[11px] text-muted-foreground">
                Enter the number of hours requested for this partial day absence.
              </p>
              {errors.requestedHours && (
                <p className="text-xs text-destructive">{errors.requestedHours.message}</p>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="requestedDays" className="font-semibold flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>Requested Days</span>
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="requestedDays"
                type="number"
                min="1"
                max="365"
                placeholder="e.g. 2"
                {...register("requestedDays", { valueAsNumber: true })}
              />
              <p className="text-[11px] text-muted-foreground">
                Total number of working days requested.
              </p>
              {errors.requestedDays && (
                <p className="text-xs text-destructive">{errors.requestedDays.message}</p>
              )}
            </div>
          )}

          {/* Date Picker Range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="fromDate" className="font-semibold text-xs">
                From Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fromDate"
                type="date"
                {...register("fromDate")}
                className="font-mono text-sm"
              />
              {errors.fromDate && (
                <p className="text-xs text-destructive">{errors.fromDate.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="toDate" className="font-semibold text-xs">
                To Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="toDate"
                type="date"
                {...register("toDate")}
                className="font-mono text-sm"
              />
              {errors.toDate && (
                <p className="text-xs text-destructive">{errors.toDate.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="returnToWorkDate" className="font-semibold text-xs">
                Return to Work Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="returnToWorkDate"
                type="date"
                {...register("returnToWorkDate")}
                className="font-mono text-sm"
              />
              {errors.returnToWorkDate && (
                <p className="text-xs text-destructive">{errors.returnToWorkDate.message}</p>
              )}
            </div>
          </div>

          {/* Alternative Employee (Handover Colleague) */}
          <div className="space-y-2">
            <Label htmlFor="alternativeEmployeeId" className="font-semibold flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Alternative Employee (Covering Colleague)</span>
            </Label>
            <Select
              value={alternativeEmployeeIdValue || "none"}
              onValueChange={(val) => setValue("alternativeEmployeeId", val === "none" ? null : val)}
            >
              <SelectTrigger id="alternativeEmployeeId" className="w-full">
                <SelectValue placeholder="Select a covering colleague (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="text-muted-foreground italic">None / Not required</span>
                </SelectItem>
                {availableAlternatives.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    <div className="flex flex-col text-start">
                      <span className="font-medium text-foreground">{emp.fullName}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {emp.jobTitle ? `${emp.jobTitle} • ` : ""}{emp.department || "General"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Select an active colleague who will cover your duties while on leave.
            </p>
          </div>

          {/* Note / Reason */}
          <div className="space-y-1.5">
            <Label htmlFor="note" className="font-semibold flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Note / Reason</span>
            </Label>
            <Textarea
              id="note"
              rows={3}
              placeholder="Provide any additional details or handover notes for your manager..."
              {...register("note")}
            />
          </div>
        </CardContent>

        <CardFooter className="p-6 border-t bg-muted/10 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="gap-2 min-w-[140px]"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Request
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
