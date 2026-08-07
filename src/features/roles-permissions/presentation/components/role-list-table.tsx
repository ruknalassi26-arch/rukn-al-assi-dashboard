"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/role-list-table.tsx
// Data Table for Security Roles & Permission Matrices Management
// ==============================================================================
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  ShieldPlus,
  Edit,
  Trash2,
  Eye,
  Shield,
  Users,
  ShieldCheck,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Input,
  Badge,
  Skeleton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@shared/ui";
import {
  useAdminRoles,
  useDeleteAdminRole,
} from "@shared/hooks/roles-permissions/use-user-role-hooks";
import { RoleDialog } from "./role-dialog";
import { RoleDetailsModal } from "./role-details-modal";
import type { RoleEntity } from "../../domain/entities/role.entity";

export function RoleListTable() {
  const t = useTranslations("rolesAdmin");
  const tCommon = useTranslations("common");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, refetch } = useAdminRoles({
    search,
    page,
    pageSize,
  });

  const deleteMutation = useDeleteAdminRole();

  const [selectedRole, setSelectedRole] = useState<(RoleEntity & { permissionIds?: string[] }) | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [viewingRoleId, setViewingRoleId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (role: RoleEntity) => {
    setSelectedRole(role);
    setIsFormDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsFormDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteMutation.mutateAsync(deletingId);
    setDeletingId(null);
  };

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`${tCommon("search")}...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <Button onClick={handleCreate} className="w-full sm:w-auto gap-2">
          <ShieldPlus className="h-4 w-4" />
          {t("addRole")}
        </Button>
      </div>

      {/* Main Roles Table */}
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("table.roleName")}</TableHead>
              <TableHead>{t("table.description")}</TableHead>
              <TableHead className="text-center">{t("table.usersCount")}</TableHead>
              <TableHead className="text-center">{t("table.permissionsCount")}</TableHead>
              <TableHead className="text-end">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-destructive">
                  Failed to load roles. <Button variant="link" onClick={() => refetch()}>Try Again</Button>
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Shield className="h-10 w-10 text-muted-foreground/50" />
                    <p className="font-medium text-base">No security roles found</p>
                    <p className="text-xs">Create your first access role using the button above.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((role) => (
                <TableRow key={role.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary shrink-0" />
                      <span>{role.name}</span>
                      {role.isSuperAdmin && (
                        <Badge className="bg-primary/10 text-primary text-[10px]">System</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-md">
                    {role.description || "Custom security access role"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="gap-1 bg-muted/30">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {role.usersCount} Users
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                      <ShieldCheck className="h-3 w-3" />
                      {role.isSuperAdmin ? "FULL" : `${role.permissionsCount} Perms`}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewingRoleId(role.id)}>
                          <Eye className="mr-2 h-4 w-4" /> {t("viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(role)}>
                          <Edit className="mr-2 h-4 w-4" /> {tCommon("edit")}
                        </DropdownMenuItem>
                        {!role.isSuperAdmin && (
                          <DropdownMenuItem
                            onClick={() => setDeletingId(role.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> {tCommon("delete")}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            {tCommon("showing")} {data?.items.length} {tCommon("of")} {data?.total} {tCommon("items")}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium">
              {tCommon("page")} {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Role Form Dialog */}
      <RoleDialog
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        role={selectedRole}
      />

      {/* Role Details Modal */}
      <RoleDetailsModal
        isOpen={!!viewingRoleId}
        onClose={() => setViewingRoleId(null)}
        roleId={viewingRoleId}
      />

      {/* Confirm Delete Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open: boolean) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. It will permanently remove this security role and its permission bindings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>
              {tCommon("cancel")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {tCommon("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
