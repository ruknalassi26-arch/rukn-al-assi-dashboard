"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/permission-checkbox-group.tsx
// Matrix Selector for RBAC Permissions by Resource (View & Manage Checkboxes)
// Enforces "Manage implies View" automatically & supports Resource Name selection.
// ==============================================================================
import { Checkbox, Label, Badge } from "@shared/ui";
import { ALL_RESOURCES, type ResourceCode } from "../../domain/entities/role.enums";
import type { PermissionEntity } from "../../domain/entities/permission.entity";

interface PermissionCheckboxGroupProps {
  allPermissions: PermissionEntity[];
  selectedPermissionIds: string[];
  onChange: (ids: string[]) => void;
}

export function PermissionCheckboxGroup({
  allPermissions,
  selectedPermissionIds,
  onChange,
}: PermissionCheckboxGroupProps) {
  // Find permission ID by resource & action or code
  const getPermissionId = (resource: string, action: "view" | "manage"): string | undefined => {
    const codeStr = `${resource}:${action}`;
    const found = allPermissions.find(
      (p) =>
        p.code === codeStr ||
        (p.module === resource && p.name?.toLowerCase().includes(action))
    );
    return found?.id;
  };

  const handleToggleAction = (resource: ResourceCode, action: "view" | "manage", checked: boolean) => {
    const viewId = getPermissionId(resource, "view");
    const manageId = getPermissionId(resource, "manage");

    let updated = [...selectedPermissionIds];

    if (action === "manage") {
      if (checked) {
        // Checking manage automatically checks view
        if (manageId && !updated.includes(manageId)) updated.push(manageId);
        if (viewId && !updated.includes(viewId)) updated.push(viewId);
      } else {
        // Unchecking manage removes manage
        if (manageId) updated = updated.filter((id) => id !== manageId);
      }
    } else if (action === "view") {
      if (checked) {
        if (viewId && !updated.includes(viewId)) updated.push(viewId);
      } else {
        // Unchecking view automatically unchecks manage too
        if (viewId) updated = updated.filter((id) => id !== viewId);
        if (manageId) updated = updated.filter((id) => id !== manageId);
      }
    }

    onChange(updated);
  };

  const handleSelectAllResource = (resource: ResourceCode, toggleState?: boolean) => {
    const viewId = getPermissionId(resource, "view");
    const manageId = getPermissionId(resource, "manage");
    let updated = [...selectedPermissionIds];

    const hasView = Boolean(viewId && updated.includes(viewId));
    const hasManage = Boolean(manageId && updated.includes(manageId));
    const isAnySelected = hasView || hasManage;

    const shouldSelect = toggleState !== undefined ? toggleState : !isAnySelected;

    if (shouldSelect) {
      if (viewId && !updated.includes(viewId)) updated.push(viewId);
      if (manageId && !updated.includes(manageId)) updated.push(manageId);
    } else {
      if (viewId) updated = updated.filter((id) => id !== viewId);
      if (manageId) updated = updated.filter((id) => id !== manageId);
    }

    onChange(updated);
  };

  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 border rounded-lg p-3.5 bg-card shadow-inner">
      <div className="flex items-center justify-between border-b pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Resource Module</span>
        <div className="flex items-center gap-8 pr-4">
          <span>View</span>
          <span>Manage</span>
        </div>
      </div>

      {ALL_RESOURCES.map((resource) => {
        const viewId = getPermissionId(resource, "view");
        const manageId = getPermissionId(resource, "manage");

        const hasView = Boolean(viewId && selectedPermissionIds.includes(viewId));
        const hasManage = Boolean(manageId && selectedPermissionIds.includes(manageId));
        const allChecked = hasView && hasManage;
        const someChecked = (hasView || hasManage) && !allChecked;

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
                <Checkbox
                  id={`perm-view-${resource}`}
                  checked={hasView}
                  onCheckedChange={(checked) => handleToggleAction(resource, "view", checked === true)}
                />
                <Label htmlFor={`perm-view-${resource}`} className="text-xs cursor-pointer text-muted-foreground select-none">
                  View
                </Label>
              </div>

              {/* Manage Checkbox */}
              <div className="flex items-center gap-1.5">
                <Checkbox
                  id={`perm-manage-${resource}`}
                  checked={hasManage}
                  onCheckedChange={(checked) => handleToggleAction(resource, "manage", checked === true)}
                />
                <Label htmlFor={`perm-manage-${resource}`} className="text-xs cursor-pointer font-medium text-primary select-none">
                  Manage
                </Label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
