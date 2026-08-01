"use client";
// ==============================================================================
// features/projects/presentation/components/delete-project-dialog.tsx
// Delete Confirmation Modal for Projects
// ==============================================================================
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@shared/ui";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useProjectsStore } from "../stores/projects.store";
import { useDeleteProjectMutation } from "@shared/hooks/projects/use-projects-hooks";

export function DeleteProjectDialog() {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const { deleteModalId, closeDeleteModal } = useProjectsStore();
  const deleteMutation = useDeleteProjectMutation();

  const isModalOpen = deleteModalId !== null;

  const handleDelete = async () => {
    if (!deleteModalId) return;
    await deleteMutation.mutateAsync(deleteModalId);
    closeDeleteModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(open: boolean) => !open && closeDeleteModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle className="text-base font-bold">{t("deleteTitle")}</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {t("deleteDesc")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            onClick={closeDeleteModal}
            disabled={deleteMutation.isPending}
            className="text-xs"
          >
            {tCommon("cancel")}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-xs gap-1.5"
          >
            {deleteMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{tCommon("delete")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
