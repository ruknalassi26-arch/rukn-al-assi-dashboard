"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/role-dialog.tsx
// Dialog for Creating & Editing Security Roles & Assigning Grouped Permissions
// ==============================================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, ShieldCheck, Save } from "lucide-react";
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
  Textarea,
} from "@shared/ui";
import { PermissionCheckboxGroup } from "./permission-checkbox-group";
import {
  useCreateAdminRole,
  useUpdateAdminRole,
  useAllPermissions,
} from "@shared/hooks/roles-permissions/use-user-role-hooks";
import type { RoleEntity } from "../../domain/entities/role.entity";

const roleSchema = z.object({
  name: z.string().min(2, "Role name is required"),
  description: z.string().optional().nullable(),
  permissionIds: z.array(z.string()),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  role: (RoleEntity & { permissionIds?: string[] }) | null;
}

export function RoleDialog({ isOpen, onClose, role }: RoleDialogProps) {
  const t = useTranslations("rolesAdmin");
  const tCommon = useTranslations("common");

  const isEditing = !!role;
  const createMutation = useCreateAdminRole();
  const updateMutation = useUpdateAdminRole();
  const { data: permissionsData } = useAllPermissions();

  const allPermissions = permissionsData ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissionIds: [],
    },
  });

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description ?? "",
        permissionIds: role.permissionIds ?? [],
      });
    } else {
      reset({
        name: "",
        description: "",
        permissionIds: [],
      });
    }
  }, [role, reset]);

  const selectedPermissionIds = watch("permissionIds");
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: RoleFormValues) => {
    if (isEditing && role) {
      await updateMutation.mutateAsync({
        id: role.id,
        input: {
          name: values.name,
          description: values.description,
          permissionIds: values.permissionIds,
        },
      });
    } else {
      await createMutation.mutateAsync({
        name: values.name,
        description: values.description,
        permissionIds: values.permissionIds,
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {isEditing ? t("editRole") : t("addRole")}
          </DialogTitle>
          <DialogDescription>
            Configure role scope and check module permissions granted to members assigned to this role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">{t("form.roleName")}</Label>
            <Input
              id="name"
              disabled={role?.code === "super_admin"}
              {...register("name")}
              placeholder="e.g. Content Editor"
            />
            {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">{t("form.description")}</Label>
            <Textarea
              id="description"
              rows={2}
              {...register("description")}
              placeholder="Brief summary of access rights granted to this role..."
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <Label className="text-sm font-semibold">{t("form.permissionsHeader")}</Label>
            <PermissionCheckboxGroup
              allPermissions={allPermissions}
              selectedPermissionIds={selectedPermissionIds}
              onChange={(ids) => setValue("permissionIds", ids)}
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
