"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/user-dialog.tsx
// Dialog for Creating & Editing Administrative User Credentials & Roles
// ==============================================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, UserPlus, Save } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@shared/ui";
import {
  useCreateAdminUser,
  useUpdateAdminUser,
  useAdminRoles,
} from "@shared/hooks/roles-permissions/use-user-role-hooks";
import type { AdminUserEntity } from "../../domain/entities/admin-user.entity";

const userSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email address is required"),
  roleId: z.string().min(1, "Role selection is required"),
  isActive: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUserEntity | null;
}

export function UserDialog({ isOpen, onClose, user }: UserDialogProps) {
  const t = useTranslations("usersAdmin");
  const tCommon = useTranslations("common");

  const isEditing = !!user;
  const createMutation = useCreateAdminUser();
  const updateMutation = useUpdateAdminUser();
  const { data: rolesData } = useAdminRoles({ pageSize: 100 });

  const roles = rolesData?.items ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      email: "",
      roleId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        roleId: user.roleId ?? "",
        isActive: user.isActive,
      });
    } else {
      reset({
        fullName: "",
        email: "",
        roleId: roles[0]?.id ?? "",
        isActive: true,
      });
    }
  }, [user, roles, reset]);

  const roleIdValue = watch("roleId");
  const isActiveValue = watch("isActive");

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: UserFormValues) => {
    if (isEditing && user) {
      await updateMutation.mutateAsync({
        id: user.id,
        input: {
          fullName: values.fullName,
          roleId: values.roleId,
          isActive: values.isActive,
        },
      });
    } else {
      await createMutation.mutateAsync(values);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            {isEditing ? t("editUser") : t("addUser")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modify user display name, assigned security role, or active status."
              : "Provision a new administrative account. Password setup email will be automatically sent."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">{t("form.fullName")}</Label>
            <Input id="fullName" {...register("fullName")} placeholder="e.g. Sarah Connor" />
            {errors.fullName && <span className="text-xs text-destructive">{errors.fullName.message}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">{t("form.email")}</Label>
            <Input
              id="email"
              type="email"
              disabled={isEditing}
              {...register("email")}
              placeholder="user@ruknalassi.com"
            />
            {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
            {isEditing && <p className="text-[11px] text-muted-foreground">Email address cannot be changed directly.</p>}
          </div>

          <div className="space-y-1.5">
            <Label>{t("form.role")}</Label>
            <Select value={roleIdValue} onValueChange={(val) => setValue("roleId", val)}>
              <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} {r.isSuperAdmin && "(Super Admin)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.roleId && <span className="text-xs text-destructive">{errors.roleId.message}</span>}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-sm font-medium">
                {t("form.status")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {isActiveValue ? t("form.activeLabel") : t("form.inactiveLabel")}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActiveValue}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
