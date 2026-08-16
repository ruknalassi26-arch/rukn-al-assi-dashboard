"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/permission-checkbox-group.tsx
// Matrix Selector for RBAC Permissions by Resource (View & Manage Checkboxes)
// Guaranteed interactive clicking, ID & Code matching, and "Manage implies View".
// ==============================================================================
import { Checkbox, Label } from "@shared/ui";
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
  // Find permission ID by resource & action or fallback to code
  const getPermissionId = (resource: string, action: "view" | "manage"): string => {
    const resLower = resource.toLowerCase().trim();
    const actLower = action.toLowerCase().trim();
    const codeStr = `${resLower}:${actLower}`;

    const found = allPermissions.find((p) => {
      const pCode = (p.code || "").toLowerCase().trim();
      const pMod = (p.module || "").toLowerCase().trim();
      const pName = (p.name || "").toLowerCase().trim();

      return (
        pCode === codeStr ||
        pCode === `${resource}:${action}` ||
        (pMod === resLower && (pCode.endsWith(actLower) || pName.includes(actLower))) ||
        (pName.includes(resLower) && pName.includes(actLower))
      );
    });

    return found?.id || codeStr;
  };

  const isItemChecked = (resource: string, action: "view" | "manage"): boolean => {
    const permId = getPermissionId(resource, action);
    const codeStr = `${resource.toLowerCase()}:${action.toLowerCase()}`;

    if (selectedPermissionIds.includes(permId)) return true;
    if (selectedPermissionIds.includes(codeStr)) return true;

    // Check if any selected item is the matching entity in allPermissions
    const matchingPerm = allPermissions.find((p) => p.id === permId || p.code === codeStr);
    if (matchingPerm) {
      if (selectedPermissionIds.includes(matchingPerm.id)) return true;
      if (selectedPermissionIds.includes(matchingPerm.code)) return true;
    }

    return false;
  };

  const handleToggleAction = (resource: ResourceCode, action: "view" | "manage", checked: boolean) => {
    const viewId = getPermissionId(resource, "view");
    const viewCode = `${resource.toLowerCase()}:view`;
    const manageId = getPermissionId(resource, "manage");
    const manageCode = `${resource.toLowerCase()}:manage`;

    let updated = [...selectedPermissionIds];

    if (action === "manage") {
      if (checked) {
        // Checking manage automatically checks view
        if (!updated.includes(manageId)) updated.push(manageId);
        if (!updated.includes(viewId)) updated.push(viewId);
      } else {
        // Unchecking manage removes manage
        updated = updated.filter((id) => id !== manageId && id !== manageCode);
      }
    } else if (action === "view") {
      if (checked) {
        if (!updated.includes(viewId)) updated.push(viewId);
      } else {
        // Unchecking view automatically unchecks manage too
        updated = updated.filter(
          (id) => id !== viewId && id !== viewCode && id !== manageId && id !== manageCode
        );
      }
    }

    onChange(updated);
  };

  const handleSelectAllResource = (resource: ResourceCode, toggleState?: boolean) => {
    const viewId = getPermissionId(resource, "view");
    const viewCode = `${resource.toLowerCase()}:view`;
    const manageId = getPermissionId(resource, "manage");
    const manageCode = `${resource.toLowerCase()}:manage`;

    const hasView = isItemChecked(resource, "view");
    const hasManage = isItemChecked(resource, "manage");
    const isAnySelected = hasView || hasManage;

    const shouldSelect = toggleState !== undefined ? toggleState : !isAnySelected;
    let updated = [...selectedPermissionIds];

    if (shouldSelect) {
      if (!updated.includes(viewId)) updated.push(viewId);
      if (!updated.includes(manageId)) updated.push(manageId);
    } else {
      updated = updated.filter(
        (id) => id !== viewId && id !== viewCode && id !== manageId && id !== manageCode
      );
    }

    onChange(updated);
  };

  return (
    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 border rounded-lg p-3.5 bg-card shadow-inner">
      <div className="flex items-center justify-between border-b pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Resource Module</span>
        <div className="flex items-center gap-8 pr-4">
          <span>View</span>
          <span>Manage</span>
        </div>
      </div>

      {ALL_RESOURCES.map((resource) => {
        const hasView = isItemChecked(resource, "view");
        const hasManage = isItemChecked(resource, "manage");
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
