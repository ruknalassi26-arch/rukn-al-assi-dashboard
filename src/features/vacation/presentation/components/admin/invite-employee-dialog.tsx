"use client";
// ==============================================================================
// features/vacation/presentation/components/admin/invite-employee-dialog.tsx
// Dialog for Admin to invite / register a new employee
// Posts to /api/admin/employees
// ==============================================================================
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Label,
} from "@shared/ui";

const inviteSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  employmentStartDate: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InviteEmployeeDialog({
  isOpen,
  onClose,
  onSuccess,
}: InviteEmployeeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      department: "",
      jobTitle: "",
      employmentStartDate: new Date().toISOString().split("T")[0],
      password: "",
    },
  });

  const onSubmit = async (values: InviteFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create employee profile.");
      }

      toast.success("Employee account & profile created successfully!");
      reset();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register employee.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Invite / Register Employee</DialogTitle>
              <DialogDescription className="text-xs">
                Create an employee profile and login account.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 pt-1">
          <div className="space-y-1">
            <Label htmlFor="fullName" className="text-xs font-medium">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="e.g. Ahmed Ali"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-[11px] text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="employee@ruknalassi.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[11px] text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <Label htmlFor="department" className="text-xs font-medium">Department</Label>
              <Input
                id="department"
                placeholder="e.g. Engineering"
                {...register("department")}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="jobTitle" className="text-xs font-medium">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Project Manager"
                {...register("jobTitle")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs font-medium">Phone</Label>
              <Input
                id="phone"
                placeholder="+964 750 ..."
                {...register("phone")}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="employmentStartDate" className="text-xs font-medium">Start Date</Label>
              <Input
                id="employmentStartDate"
                type="date"
                {...register("employmentStartDate")}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-medium">Initial Password (Optional)</Label>
            <Input
              id="password"
              type="password"
              placeholder="Leave blank to generate automatically"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-[11px] text-destructive">{errors.password.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Register Employee
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
