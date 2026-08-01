"use client";
// ==============================================================================
// features/projects/presentation/components/delete-project-dialog.tsx
// Confirmation Dialog for Project Deletion
// ==============================================================================
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@shared/ui";
import { Loader2, AlertTriangle } from "lucide-react";
import { useProjectsStore } from "../stores/projects.store";
import { useDeleteProjectMutation } from "@shared/hooks/projects/use-projects-hooks";

export function DeleteProjectDialog() {
  const { deleteModalId, closeDeleteModal } = useProjectsStore();
  const deleteMutation = useDeleteProjectMutation();

  const isOpen = Boolean(deleteModalId);

  const handleDelete = async () => {
    if (!deleteModalId) return;
    await deleteMutation.mutateAsync(deleteModalId);
    closeDeleteModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDeleteModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-bold">Delete Project</DialogTitle>
          <DialogDescription className="text-xs">
            Are you sure you want to delete this project? This action cannot be undone and will remove the project cover and gallery images.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={closeDeleteModal}
            disabled={deleteMutation.isPending}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-xs gap-1.5"
          >
            {deleteMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>Delete Project</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
