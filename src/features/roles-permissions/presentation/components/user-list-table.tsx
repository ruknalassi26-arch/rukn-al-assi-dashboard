"use client";
// ==============================================================================
// features/roles-permissions/presentation/components/user-list-table.tsx
// Data Table for Administrative Users Management
// ==============================================================================
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  UserPlus,
  Edit,
  UserCheck,
  UserX,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Mail,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Skeleton,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui";
import {
  useAdminUsers,
  useAdminRoles,
  useToggleUserActiveStatus,
} from "@shared/hooks/roles-permissions/use-user-role-hooks";
import { UserDialog } from "./user-dialog";
import type { AdminUserEntity } from "../../domain/entities/admin-user.entity";

export function UserListTable() {
  const t = useTranslations("usersAdmin");
  const tCommon = useTranslations("common");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const isActiveParam = statusFilter === "active" ? true : statusFilter === "inactive" ? false : "all";

  const { data, isLoading, isError, refetch } = useAdminUsers({
    search,
    roleId: roleFilter !== "all" ? roleFilter : undefined,
    isActive: isActiveParam,
    page,
    pageSize,
  });

  const { data: rolesData } = useAdminRoles({ pageSize: 100 });
  const roles = rolesData?.items ?? [];

  const toggleActiveMutation = useToggleUserActiveStatus();

  const [selectedUser, setSelectedUser] = useState<AdminUserEntity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (user: AdminUserEntity) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = async (user: AdminUserEntity) => {
    await toggleActiveMutation.mutateAsync({
      id: user.id,
      isActive: !user.isActive,
    });
  };

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
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

          <Select
            value={roleFilter}
            onValueChange={(val) => {
              setRoleFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("table.role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tCommon("all")} Roles</SelectItem>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={tCommon("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tCommon("all")}</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleCreate} className="w-full sm:w-auto gap-2">
          <UserPlus className="h-4 w-4" />
          {t("addUser")}
        </Button>
      </div>

      {/* Main Users Table */}
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[60px]">{t("table.avatar")}</TableHead>
              <TableHead>{t("table.fullName")}</TableHead>
              <TableHead>{t("table.email")}</TableHead>
              <TableHead>{t("table.role")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.lastLogin")}</TableHead>
              <TableHead>{t("table.createdAt")}</TableHead>
              <TableHead className="text-end">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ms-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-destructive">
                  Failed to load users. <Button variant="link" onClick={() => refetch()}>Try Again</Button>
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <UserPlus className="h-10 w-10 text-muted-foreground/50" />
                    <p className="font-medium text-base">{t("emptyTitle")}</p>
                    <p className="text-xs">{t("emptyDescription")}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((user) => {
                const initials = user.fullName
                  ? user.fullName.substring(0, 2).toUpperCase()
                  : user.email.substring(0, 2).toUpperCase();

                return (
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <Avatar className="h-8 w-8 border">
                        <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {user.fullName}
                    </TableCell>
                    <TableCell>
                      <a href={`mailto:${user.email}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span>{user.email}</span>
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1 bg-primary/5 text-primary border-primary/20">
                        <Shield className="h-3 w-3" />
                        {user.roleName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30 font-semibold">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Edit className="me-2 h-4 w-4" /> {tCommon("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user)}
                            className={user.isActive ? "text-amber-600" : "text-emerald-600"}
                          >
                            {user.isActive ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" /> {t("deactivate")}
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" /> {t("activate")}
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
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

      {/* User Form Dialog */}
      <UserDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
