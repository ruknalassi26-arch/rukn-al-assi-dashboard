"use client";
// ==============================================================================
// features/rfq/presentation/pages/rfq-list-page.tsx
// Main RFQ Management Page
// ==============================================================================
import { RfqTable } from "../components/rfq-table";
import { RfqDetailsDrawer } from "../components/rfq-details-drawer";
import { RfqEmailModal } from "../components/rfq-email-modal";
import { AttachmentViewerDialog } from "../components/attachment-viewer-dialog";

export function RfqListPage() {
  return (
    <div className="space-y-6">
      <RfqTable />
      <RfqDetailsDrawer />
      <RfqEmailModal />
      <AttachmentViewerDialog />
    </div>
  );
}
