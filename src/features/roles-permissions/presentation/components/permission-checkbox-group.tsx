"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/permission-checkbox-group.tsx
// Matrix Selector for RBAC Permissions strictly from database permissions table
// Supports Full Access / Super Admin visualization and disabled states.
// ==============================================================================
import { Checkbox, Label } from "@shared/ui";
import type { PermissionEntity } from "../../domain/entities/permission.entity";

interface PermissionCheckboxGroupProps {
  allPermissions: PermissionEntity[];
  selectedPermissionIds: string[];
  onChange: (ids: string[]) => void;
  isFullAccess?: boolean;
  disabled?: boolean;
}

export function PermissionCheckboxGroup({
  allPermissions,
  selectedPermissionIds,
  onChange,
  isFullAccess = false,
  disabled = false,
}: PermissionCheckboxGroupProps) {
  // Find permission ID by resource & action strictly from database permissions
  const getPermissionId = (resource: string, action: "view" | "manage"): string | undefined => {
    const resLower = resource.toLowerCase().trim();
    const actLower = action.toLowerCase().trim();
    const codeStr = `${resLower}:${actLower}`;

    const found = allPermissions.find(
      (p) =>
        (p.code || "").toLowerCase().trim() === codeStr ||
        ((p.module || "").toLowerCase().trim() === resLower && (p.code || "").toLowerCase().endsWith(actLower))
    );

    return found?.id;
  };

  const isItemChecked = (resource: string, action: "view" | "manage"): boolean => {
    if (isFullAccess) return true;
    const permId = getPermissionId(resource, action);
    if (!permId) return false;
    return selectedPermissionIds.includes(permId);
  };

  const handleToggleAction = (resource: string, action: "view" | "manage", checked: boolean) => {
    if (disabled || isFullAccess) return;

    const viewId = getPermissionId(resource, "view");
    const manageId = getPermissionId(resource, "manage");

    let updated = [...selectedPermissionIds];

    if (action === "manage") {
      if (checked) {
        if (manageId && !updated.includes(manageId)) updated.push(manageId);
        if (viewId && !updated.includes(viewId)) updated.push(viewId);
      } else {
        if (manageId) updated = updated.filter((id) => id !== manageId);
      }
    } else if (action === "view") {
      if (checked) {
        if (viewId && !updated.includes(viewId)) updated.push(viewId);
      } else {
        if (viewId) updated = updated.filter((id) => id !== viewId);
        if (manageId) updated = updated.filter((id) => id !== manageId);
      }
    }

    onChange(updated);
  };

  const handleSelectAllResource = (resource: string, toggleState?: boolean) => {
    if (disabled || isFullAccess) return;

    const viewId = getPermissionId(resource, "view");
    const manageId = getPermissionId(resource, "manage");

    const hasView = isItemChecked(resource, "view");
    const hasManage = isItemChecked(resource, "manage");
    const isAnySelected = hasView || hasManage;

    const shouldSelect = toggleState !== undefined ? toggleState : !isAnySelected;
    let updated = [...selectedPermissionIds];

    if (shouldSelect) {
      if (viewId && !updated.includes(viewId)) updated.push(viewId);
      if (manageId && !updated.includes(manageId)) updated.push(manageId);
    } else {
      if (viewId) updated = updated.filter((id) => id !== viewId);
      if (manageId) updated = updated.filter((id) => id !== manageId);
    }

    onChange(updated);
  };

  // Distinct resources present in database permissions
  const availableResources = Array.from(
    new Set(
      allPermissions
        .map((p) => (p.module || (p.code.includes(":") ? p.code.split(":")[0] : "")).toLowerCase().trim())
        .filter(Boolean)
    )
  ).sort();

  return (
    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 border rounded-lg p-3.5 bg-card shadow-inner">
      <div className="flex items-center justify-between border-b pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Resource Module</span>
        <div className="flex items-center gap-8 pr-4">
          <span>View</span>
          <span>Manage</span>
        </div>
      </div>

      {availableResources.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground">
          Loading module permissions...
        </div>
      ) : (
        availableResources.map((resource) => {
          const viewId = getPermissionId(resource, "view");
          const manageId = getPermissionId(resource, "manage");

          const hasView = isItemChecked(resource, "view");
          const hasManage = isItemChecked(resource, "manage");
          const allChecked = isFullAccess || (Boolean(viewId) === hasView && Boolean(manageId) === hasManage && (hasView || hasManage));
          const someChecked = !isFullAccess && (hasView || hasManage) && !allChecked;

          return (
            <div
              key={resource}
              className="flex items-center justify-between py-2 border-b last:border-b-0 hover:bg-muted/30 px-2 rounded-md transition-colors"
            >
              {/* Resource Select All Checkbox & Label */}
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`resource-all-${resource}`}
                  checked={allChecked ? true : someChecked ? "indeterminate" : false}
                  disabled={disabled || isFullAccess}
                  onCheckedChange={(checked) =>
                    handleSelectAllResource(resource, checked === "indeterminate" ? true : checked === true)
                  }
                />
                <Label
                  htmlFor={`resource-all-${resource}`}
                  className="font-semibold text-sm capitalize cursor-pointer text-foreground select-none"
                >
                  {resource.replace("_", " ")}
                </Label>
              </div>

              {/* View & Manage Actions */}
              <div className="flex items-center gap-12 pr-4">
                {/* View Checkbox */}
                <div className="flex items-center gap-1.5">
                  {viewId || isFullAccess ? (
                    <>
                      <Checkbox
                        id={`perm-view-${resource}`}
                        checked={hasView}
                        disabled={disabled || isFullAccess}
                        onCheckedChange={(checked) => handleToggleAction(resource, "view", checked === true)}
                      />
                      <Label htmlFor={`perm-view-${resource}`} className="text-xs cursor-pointer text-muted-foreground select-none">
                        View
                      </Label>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground/40 italic">—</span>
                  )}
                </div>

                {/* Manage Checkbox */}
                <div className="flex items-center gap-1.5">
                  {manageId || isFullAccess ? (
                    <>
                      <Checkbox
                        id={`perm-manage-${resource}`}
                        checked={hasManage}
                        disabled={disabled || isFullAccess}
                        onCheckedChange={(checked) => handleToggleAction(resource, "manage", checked === true)}
                      />
                      <Label htmlFor={`perm-manage-${resource}`} className="text-xs cursor-pointer font-medium text-primary select-none">
                        Manage
                      </Label>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground/40 italic">—</span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
