"use client";
// ==============================================================================
// features/rfq/presentation/components/attachment-viewer-dialog.tsx
// Attachment Preview & Download Dialog Component
// ==============================================================================
import React from "react";
import Image from "next/image";
import { Download, FileText, ExternalLink, Paperclip } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@shared/ui";
import { useRfqStore } from "../stores/rfq.store";

export function AttachmentViewerDialog() {
  const { attachmentViewerOpen, currentAttachmentUrl, closeAttachmentViewer } = useRfqStore();

  if (!currentAttachmentUrl) return null;

  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(currentAttachmentUrl);
  const isPdf = /\.pdf$/i.test(currentAttachmentUrl);

  return (
    <Dialog open={attachmentViewerOpen} onOpenChange={(open) => !open && closeAttachmentViewer()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Paperclip className="h-5 w-5 text-primary" />
              <span>RFQ Attachment Document</span>
            </div>
            <div className="flex items-center gap-2">
              <a href={currentAttachmentUrl} target="_blank" rel="noopener noreferrer" download>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Download className="h-4 w-4" /> Download File
                </Button>
              </a>
              <a href={currentAttachmentUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="gap-1.5">
                  <ExternalLink className="h-4 w-4" /> Open New Tab
                </Button>
              </a>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 flex flex-col items-center justify-center min-h-[300px]">
          {isImage ? (
            <div className="relative h-[500px] w-full border rounded-lg overflow-hidden bg-muted">
              <Image
                src={currentAttachmentUrl}
                alt="RFQ Attachment Preview"
                fill
                className="object-contain"
              />
            </div>
          ) : isPdf ? (
            <iframe
              src={currentAttachmentUrl}
              className="w-full h-[550px] border rounded-lg"
              title="PDF Attachment Preview"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border rounded-lg bg-muted/20 w-full">
              <FileText className="h-16 w-16 text-muted-foreground/60" />
              <div>
                <h4 className="text-base font-semibold">Document Preview Unavailable</h4>
                <p className="text-sm text-muted-foreground">
                  This file type cannot be previewed directly in browser. Please download the file to view.
                </p>
              </div>
              <a href={currentAttachmentUrl} target="_blank" rel="noopener noreferrer" download>
                <Button className="gap-2">
                  <Download className="h-4 w-4" /> Download File
                </Button>
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
