// ==============================================================================
// features/vacation/presentation/components/employee/request-vacation-form.tsx
// Form for employee to request vacation / time off
// ==============================================================================

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui";
import {
  Calendar as CalendarIcon,
  Send,
  UserCheck,
  Info,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  useVacationTypes,
  useActiveColleagues,
  useCreateVacationRequest,
  useMyVacationDashboard,
} from "../../hooks/use-vacation";
import { toast } from "@core/utils/toast";

export function RequestVacationForm() {
  const router = useRouter();
  const { data: vacationTypes = [], isLoading: isLoadingTypes } = useVacationTypes();
  const { data: colleagues = [], isLoading: isLoadingColleagues } = useActiveColleagues();
  const { data: dashboard } = useMyVacationDashboard();
  const createMutation = useCreateVacationRequest();

  const [vacationTypeId, setVacationTypeId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [returnToWorkDate, setReturnToWorkDate] = useState("");
  const [alternativeEmployeeId, setAlternativeEmployeeId] = useState("");
  const [note, setNote] = useState("");

  const selectedType = useMemo(
    () => vacationTypes.find((t) => t.id === vacationTypeId) || vacationTypes[0],
    [vacationTypes, vacationTypeId]
  );

  const selectedBalance = useMemo(() => {
    if (!dashboard?.balances || !selectedType) return null;
    return (
      dashboard.balances.find((b) => b.vacationTypeId === selectedType.id) ||
      dashboard.balances[0]
    );
  }, [dashboard, selectedType]);

  // Calculate estimated working days (inclusive)
  const calculatedDays = useMemo(() => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (end < start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [fromDate, toDate]);

  const handleFromDateChange = (val: string) => {
    setFromDate(val);
    if (!toDate || toDate < val) setToDate(val);
    if (!returnToWorkDate || returnToWorkDate <= val) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 1);
      setReturnToWorkDate(nextDay.toISOString().split("T")[0]);
    }
  };

  const handleToDateChange = (val: string) => {
    setToDate(val);
    if (!returnToWorkDate || returnToWorkDate <= val) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 1);
      setReturnToWorkDate(nextDay.toISOString().split("T")[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const typeId = vacationTypeId || vacationTypes[0]?.id;
    if (!typeId) {
      toast.error("Please select a vacation type");
      return;
    }

    if (!fromDate || !toDate || !returnToWorkDate) {
      toast.error("Please select start date, end date, and return to work date");
      return;
    }

    if (toDate < fromDate) {
      toast.error("End date cannot be earlier than start date");
      return;
    }

    if (returnToWorkDate < toDate) {
      toast.error("Return to work date cannot be earlier than end date");
      return;
    }

    try {
      await createMutation.mutateAsync({
        vacationTypeId: typeId,
        fromDate,
        toDate,
        returnToWorkDate,
        alternativeEmployeeId: alternativeEmployeeId || null,
        note: note.trim() || null,
      });

      router.push("/employee/vacation");
    } catch {
      // Error handled in hook toast
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Section */}
      <Card className="lg:col-span-2 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Submit Time Off Request
          </CardTitle>
          <CardDescription className="text-xs">
            Fill in the details below to submit a leave or vacation request for approval.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vacation Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Leave / Vacation Type *</Label>
              <Select
                value={vacationTypeId || vacationTypes[0]?.id || ""}
                onValueChange={setVacationTypeId}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue
                    placeholder={
                      isLoadingTypes ? "Loading types..." : "Select leave type..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {vacationTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="text-xs">
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Start Date *</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => handleFromDateChange(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">End Date *</Label>
                <Input
                  type="date"
                  value={toDate}
                  min={fromDate}
                  onChange={(e) => handleToDateChange(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>
            </div>

            {/* Return to work date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Expected Return to Work Date *</Label>
              <Input
                type="date"
                value={returnToWorkDate}
                min={toDate || fromDate}
                onChange={(e) => setReturnToWorkDate(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            {/* Covering colleague */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Covering Colleague during Absence (Optional)
              </Label>
              <Select
                value={alternativeEmployeeId}
                onValueChange={setAlternativeEmployeeId}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue
                    placeholder={
                      isLoadingColleagues
                        ? "Loading colleagues..."
                        : "Select colleague to cover your duties..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {colleagues.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id} className="text-xs">
                      {emp.fullName} ({emp.department || "Employee"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Reason / Additional Notes (Optional)</Label>
              <Textarea
                placeholder="Briefly state reason or emergency handover notes..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-xs resize-none"
                rows={3}
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs"
                disabled={createMutation.isPending || !fromDate || !toDate}
              >
                <Send className="h-4 w-4 mr-1.5" />
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Summary & Balance Impact Preview */}
      <div className="space-y-4">
        <Card className="shadow-sm border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Request Summary Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b">
              <span className="text-muted-foreground">Leave Type:</span>
              <span className="font-medium text-foreground">
                {selectedType?.name || "Vacation"}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b">
              <span className="text-muted-foreground">Requested Duration:</span>
              <span className="font-bold text-primary text-sm">
                {calculatedDays} {calculatedDays === 1 ? "Day" : "Days"}
              </span>
            </div>

            {selectedBalance && (
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Current Available Balance:</span>
                <span className="font-medium text-foreground">
                  {selectedBalance.remaining} Days
                </span>
              </div>
            )}

            {selectedBalance && calculatedDays > 0 && (
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Balance After Approval:</span>
                <span
                  className={`font-semibold ${
                    selectedBalance.remaining - calculatedDays < 0
                      ? "text-destructive"
                      : "text-emerald-600"
                  }`}
                >
                  {selectedBalance.remaining - calculatedDays} Days
                </span>
              </div>
            )}

            <div className="pt-2">
              <div className="rounded-lg bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <Info className="h-3.5 w-3.5 text-primary" />
                  Approval Workflow
                </div>
                <p>
                  Your request will be routed to HR / Management for review. You will receive real-time updates on status changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
