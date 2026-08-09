"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/role-dialog.tsx
// Dialog for Creating & Editing Security Roles with Predefined Templates & Matrix
// Compact Layout without Extra Whitespace
// ==============================================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, ShieldCheck, Save, Sparkles } from "lucide-react";
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
  Badge,
} from "@shared/ui";
import { PermissionCheckboxGroup } from "./permission-checkbox-group";
import { ROLE_TEMPLATES } from "../../domain/entities/role-permission.matrix";
import type { PermissionCode } from "../../domain/entities/role.enums";
import {
  useCreateAdminRole,
  useUpdateAdminRole,
  useAdminRoleById,
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
  const { data: roleDetail, isLoading: isLoadingDetail } = useAdminRoleById(role?.id ?? "");

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
      const activeRole = roleDetail || role;
      reset({
        name: activeRole.name,
        description: activeRole.description ?? "",
        permissionIds: (activeRole as { permissionIds?: string[] }).permissionIds ?? role.permissionIds ?? [],
      });
    } else {
      reset({
        name: "",
        description: "",
        permissionIds: [],
      });
    }
  }, [role, roleDetail, reset]);

  const selectedPermissionIds = watch("permissionIds");
  const isPending = createMutation.isPending || updateMutation.isPending;

  const applyTemplate = (templateSlug: string) => {
    const template = ROLE_TEMPLATES.find((t) => t.slug === templateSlug);
    if (!template) return;

    if (!watch("name")) {
      setValue("name", template.name);
    }
    setValue("description", template.description);

    // Map template permission codes to IDs in database
    const templateIds: string[] = [];
    allPermissions.forEach((p) => {
      const pCode = p.code || `${p.module}:${p.name}`;
      if (template.permissions.includes(pCode as PermissionCode)) {
        templateIds.push(p.id);
      }
    });

    setValue("permissionIds", templateIds);
  };

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
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {isEditing ? t("editRole") : t("addRole")}
          </DialogTitle>
          <DialogDescription>
            Configure role scope, apply predefined templates, and select module permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!isEditing && (
              <div className="bg-muted/20 border rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" /> Apply Role Template
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ROLE_TEMPLATES.map((tmpl) => (
                    <Button
                      key={tmpl.slug}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => applyTemplate(tmpl.slug)}
                    >
                      {tmpl.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">{t("form.roleName")} *</Label>
              <Input
                id="name"
                disabled={role?.code === "super_admin" || role?.isSystemRole}
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
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">{t("form.permissionsHeader")}</Label>
                <Badge variant="secondary" className="text-xs font-mono">
                  {selectedPermissionIds.length} permissions granted
                </Badge>
              </div>
              <PermissionCheckboxGroup
                allPermissions={allPermissions}
                selectedPermissionIds={selectedPermissionIds}
                onChange={(ids) => setValue("permissionIds", ids)}
              />
            </div>
          </div>

          <DialogFooter className="p-4 border-t bg-muted/20 mt-auto">
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
