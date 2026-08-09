"use client";
// ==============================================================================
// features/languages/presentation/components/language-list-table.tsx
// Data Table for Managing System Languages & Translation Requirements
// ==============================================================================
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  ArrowUpDown,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
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
  useLanguages,
  useDeleteLanguage,
  useUpdateLanguage,
} from "@shared/hooks/settings/use-language-hooks";
import { usePermission } from "@features/roles-permissions/presentation/hooks/use-permission";
import { LanguageDialog } from "./language-dialog";
import type { LanguageEntity } from "../../domain/entities/language.entity";

export function LanguageListTable() {
  const tCommon = useTranslations("common");
  const { hasPermission } = usePermission();
  const canManage = hasPermission("settings", "manage");

  const { data: languages, isLoading, isError, refetch } = useLanguages();
  const deleteMutation = useDeleteLanguage();
  const updateMutation = useUpdateLanguage();

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageEntity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const handleCreate = () => {
    setSelectedLanguage(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (lang: LanguageEntity) => {
    setSelectedLanguage(lang);
    setIsDialogOpen(true);
  };

  const handleToggleRequired = async (lang: LanguageEntity) => {
    await updateMutation.mutateAsync({
      code: lang.code,
      input: { isRequired: !lang.isRequired },
    });
  };

  const handleToggleActive = async (lang: LanguageEntity) => {
    await updateMutation.mutateAsync({
      code: lang.code,
      input: { isActive: !lang.isActive },
    });
  };

  const handleDelete = async () => {
    if (!deletingCode) return;
    await deleteMutation.mutateAsync(deletingCode);
    setDeletingCode(null);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> System Languages & Localization
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage supported languages, direction (RTL/LTR), and mandatory translation rules across the portal.
          </p>
        </div>

        {canManage && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add Language
          </Button>
        )}
      </div>

      {/* Main Languages Table */}
      <div className="rounded-md border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-20">Code</TableHead>
              <TableHead>Language Name</TableHead>
              <TableHead>Native Name</TableHead>
              <TableHead className="text-center">Direction</TableHead>
              <TableHead className="text-center">Translation Policy</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-destructive">
                  Failed to load system languages. <Button variant="link" onClick={() => refetch()}>Try Again</Button>
                </TableCell>
              </TableRow>
            ) : !languages || languages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Globe className="h-10 w-10 text-muted-foreground/50" />
                    <p className="font-medium text-base">No languages configured</p>
                    <p className="text-xs">Add supported languages using the button above.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              languages.map((lang) => (
                <TableRow key={lang.code} className="hover:bg-muted/30 transition-colors">
                  {/* Code */}
                  <TableCell className="font-mono font-bold text-xs uppercase text-primary">
                    <Badge variant="outline" className="font-mono bg-primary/5 border-primary/20">
                      {lang.code}
                    </Badge>
                  </TableCell>

                  {/* English Name */}
                  <TableCell className="font-semibold text-foreground">
                    {lang.name}
                  </TableCell>

                  {/* Native Name */}
                  <TableCell className="font-medium text-muted-foreground dir-auto">
                    {lang.nativeName}
                  </TableCell>

                  {/* Direction */}
                  <TableCell className="text-center">
                    {lang.isRtl ? (
                      <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20">
                        RTL (Right-to-Left)
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        LTR (Left-to-Right)
                      </Badge>
                    )}
                  </TableCell>

                  {/* Translation Policy (Required vs Optional) */}
                  <TableCell className="text-center">
                    {lang.isRequired ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!canManage}
                        onClick={() => handleToggleRequired(lang)}
                        className="h-7 text-xs gap-1 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Mandatory
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!canManage}
                        onClick={() => handleToggleRequired(lang)}
                        className="h-7 text-xs gap-1 text-muted-foreground hover:bg-muted"
                      >
                        <XCircle className="h-3.5 w-3.5 text-muted-foreground" /> Optional
                      </Button>
                    )}
                  </TableCell>

                  {/* Active Status */}
                  <TableCell className="text-center">
                    {lang.isActive ? (
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[11px]">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[11px] text-muted-foreground">
                        Disabled
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-end">
                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(lang)}>
                            <Edit className="mr-2 h-4 w-4" /> {tCommon("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(lang)}>
                            <ArrowUpDown className="mr-2 h-4 w-4" />
                            {lang.isActive ? "Deactivate Language" : "Activate Language"}
                          </DropdownMenuItem>
                          {!lang.isRequired && (
                            <DropdownMenuItem
                              onClick={() => setDeletingCode(lang.code)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> {tCommon("delete")}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Language Dialog */}
      <LanguageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        language={selectedLanguage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingCode} onOpenChange={(open: boolean) => !open && setDeletingCode(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" /> Delete Language
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the language code <strong>{deletingCode?.toUpperCase()}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingCode(null)}>
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
