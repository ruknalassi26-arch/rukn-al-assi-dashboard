"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/role-details-modal.tsx
// Role Details View Modal displaying granted permissions & assigned users
// ==============================================================================
import { useTranslations } from "next-intl";
import { Shield, ShieldCheck, Users, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Badge,
  Skeleton,
} from "@shared/ui";
import { useAdminRoleById } from "@shared/hooks/roles-permissions/use-user-role-hooks";

interface RoleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string | null;
}

export function RoleDetailsModal({ isOpen, onClose, roleId }: RoleDetailsModalProps) {
  const t = useTranslations("rolesAdmin");
  const tCommon = useTranslations("common");

  const { data: roleDetail, isLoading } = useAdminRoleById(roleId ?? "");

  if (!roleId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <DialogTitle>{t("details.title")}</DialogTitle>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : !roleDetail ? (
          <p className="text-center py-6 text-muted-foreground">Role details not found.</p>
        ) : (
          <div className="space-y-6 py-2">
            {/* Header info */}
            <div className="border p-4 rounded-lg bg-muted/10 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {roleDetail.name}
                  {roleDetail.isSuperAdmin && <Badge className="bg-primary/10 text-primary">Super Admin</Badge>}
                </h3>
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" /> {roleDetail.usersCount} Users
                </Badge>
              </div>
              {roleDetail.description && (
                <p className="text-xs text-muted-foreground">{roleDetail.description}</p>
              )}
            </div>

            {/* Granted Permissions List */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {t("details.grantedPermissions")} ({roleDetail.permissionEntities?.length ?? 0})
              </h4>

              {roleDetail.isSuperAdmin ? (
                <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400">
                  ⚡ Super Admin role implicitly grants full unrestricted access across all system modules.
                </div>
              ) : roleDetail.permissionEntities?.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No permissions assigned to this role.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {roleDetail.permissionEntities?.map((perm) => (
                    <div key={perm.id} className="flex items-center gap-2 border p-2 rounded-md bg-card text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <div>
                        <p className="font-medium">{perm.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{perm.module}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {tCommon("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
