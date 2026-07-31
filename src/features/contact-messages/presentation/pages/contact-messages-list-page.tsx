"use client";
// ==============================================================================
// features/contact-messages/presentation/pages/contact-messages-list-page.tsx
// Main Customer Contact Messages Inbox Page
// ==============================================================================
import { ContactMessagesTable } from "../components/contact-messages-table";
import { MessageDetailsDrawer } from "../components/message-details-drawer";
import { MessageEmailReplyModal } from "../components/message-email-reply-modal";

export function ContactMessagesListPage() {
  return (
    <div className="space-y-6">
      <ContactMessagesTable />
      <MessageDetailsDrawer />
      <MessageEmailReplyModal />
    </div>
  );
}
