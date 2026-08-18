// ==============================================================================
// features/vacation/presentation/components/admin/admin-create-vacation-dialog.tsx
// Dialog for Admin to create/record vacation on behalf of an employee
// ==============================================================================

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { PlusCircle, Calendar, UserCheck } from "lucide-react";
import {
  useAdminEmployees,
  useVacationTypes,
  useAdminCreateVacationRequest,
} from "../../hooks/use-vacation";
import { toast } from "@core/utils/toast";

interface AdminCreateVacationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmployeeId?: string;
}

export function AdminCreateVacationDialog({
  isOpen,
  onClose,
  initialEmployeeId,
}: AdminCreateVacationDialogProps) {
  const { data: employees = [], isLoading: isLoadingEmployees } = useAdminEmployees();
  const { data: vacationTypes = [], isLoading: isLoadingTypes } = useVacationTypes();
  const createMutation = useAdminCreateVacationRequest();

  const [employeeId, setEmployeeId] = useState(initialEmployeeId || "");
  const [vacationTypeId, setVacationTypeId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [returnToWorkDate, setReturnToWorkDate] = useState("");
  const [alternativeEmployeeId, setAlternativeEmployeeId] = useState("");
  const [note, setNote] = useState("");

  const resetForm = () => {
    setEmployeeId("");
    setVacationTypeId("");
    setFromDate("");
    setToDate("");
    setReturnToWorkDate("");
    setAlternativeEmployeeId("");
    setNote("");
  };

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

    if (!employeeId) {
      toast.error("Please select an employee");
      return;
    }

    const typeId = vacationTypeId || vacationTypes[0]?.id;
    if (!typeId) {
      toast.error("Please select a vacation type");
      return;
    }

    if (!fromDate || !toDate || !returnToWorkDate) {
      toast.error("Please provide start, end, and return to work dates");
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
        employeeId,
        vacationTypeId: typeId,
        fromDate,
        toDate,
        returnToWorkDate,
        alternativeEmployeeId: alternativeEmployeeId || null,
        note: note.trim() || null,
      });

      resetForm();
      onClose();
    } catch {
      // Error handled in hook
    }
  };

  const availableColleagues = employees.filter((emp) => emp.id !== employeeId);

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <PlusCircle className="h-5 w-5 text-primary" />
            Record Vacation on Behalf of Employee
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Select Employee */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Select Employee *</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger className="text-xs">
                <SelectValue
                  placeholder={
                    isLoadingEmployees ? "Loading employees..." : "Choose employee..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id} className="text-xs">
                    {emp.fullName} ({emp.department || "No Department"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select Vacation Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Leave Type *</Label>
            <Select
              value={vacationTypeId || vacationTypes[0]?.id || ""}
              onValueChange={setVacationTypeId}
            >
              <SelectTrigger className="text-xs">
                <SelectValue
                  placeholder={
                    isLoadingTypes ? "Loading leave types..." : "Choose leave type..."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">From Date *</Label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => handleFromDateChange(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">To Date *</Label>
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

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Return to Work Date *</Label>
            <Input
              type="date"
              value={returnToWorkDate}
              min={toDate || fromDate}
              onChange={(e) => setReturnToWorkDate(e.target.value)}
              className="text-xs"
              required
            />
          </div>

          {/* Covering / Alternative Employee */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Covering Colleague (Optional)
            </Label>
            <Select
              value={alternativeEmployeeId}
              onValueChange={setAlternativeEmployeeId}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select covering colleague..." />
              </SelectTrigger>
              <SelectContent>
                {availableColleagues.map((colleague) => (
                  <SelectItem key={colleague.id} value={colleague.id} className="text-xs">
                    {colleague.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Admin Note */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Note / Reason (Optional)</Label>
            <Textarea
              placeholder="e.g. Annual leave pre-approved by management"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="text-xs resize-none"
              rows={2}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs"
              disabled={createMutation.isPending}
            >
              <UserCheck className="h-4 w-4 mr-1.5" />
              Record & Approve Leave
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
