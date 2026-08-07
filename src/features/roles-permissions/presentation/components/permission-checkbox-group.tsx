"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/permission-checkbox-group.tsx
// Grouped Checkboxes Selector for System Permissions by Module
// ==============================================================================
import { Checkbox, Label, Badge } from "@shared/ui";
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
  // Group permissions by module
  const groupedModules = allPermissions.reduce<Record<string, PermissionEntity[]>>((acc, perm) => {
    const mod = perm.module || "General Settings";
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(perm);
    return acc;
  }, {});

  const handleToggleSingle = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedPermissionIds, id]);
    } else {
      onChange(selectedPermissionIds.filter((pId) => pId !== id));
    }
  };

  const handleToggleModule = (modulePerms: PermissionEntity[], checked: boolean) => {
    const moduleIds = modulePerms.map((p) => p.id);
    if (checked) {
      const merged = Array.from(new Set([...selectedPermissionIds, ...moduleIds]));
      onChange(merged);
    } else {
      onChange(selectedPermissionIds.filter((pId) => !moduleIds.includes(pId)));
    }
  };

  return (
    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 border rounded-md p-4 bg-muted/10">
      {Object.entries(groupedModules).map(([moduleName, perms]) => {
        const moduleIds = perms.map((p) => p.id);
        const allSelected = moduleIds.every((id) => selectedPermissionIds.includes(id));
        const someSelected = moduleIds.some((id) => selectedPermissionIds.includes(id)) && !allSelected;

        return (
          <div key={moduleName} className="space-y-2 border-b last:border-b-0 pb-3 last:pb-0">
            {/* Module Group Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`module-${moduleName}`}
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={(checked) => handleToggleModule(perms, checked === true)}
                />
                <Label htmlFor={`module-${moduleName}`} className="font-bold text-sm uppercase tracking-wider text-primary cursor-pointer">
                  {moduleName}
                </Label>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {perms.filter((p) => selectedPermissionIds.includes(p.id)).length} / {perms.length}
              </Badge>
            </div>

            {/* Individual Permissions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 pt-1">
              {perms.map((perm) => {
                const isChecked = selectedPermissionIds.includes(perm.id);
                return (
                  <div key={perm.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`perm-${perm.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => handleToggleSingle(perm.id, checked === true)}
                    />
                    <Label htmlFor={`perm-${perm.id}`} className="text-xs text-foreground cursor-pointer font-normal">
                      {perm.name || perm.code}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
