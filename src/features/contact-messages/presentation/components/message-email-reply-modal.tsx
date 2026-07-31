"use client";
// ==============================================================================
// features/contact-messages/presentation/components/message-email-reply-modal.tsx
// Email Reply Dialog Component for Customer Contact Messages
// ==============================================================================
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Send, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
  Label,
  Textarea,
} from "@shared/ui";
import { useContactMessagesStore } from "../stores/contact-messages.store";
import { useContactMessage, useSendMessageReply } from "@shared/hooks/contact-messages/use-contact-messages-hooks";

const messageReplySchema = z.object({
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message body must be at least 10 characters"),
});

export type MessageReplyFormValues = z.infer<typeof messageReplySchema>;

export function MessageEmailReplyModal() {
  const { emailModalOpen, selectedMessageId, closeEmailModal } = useContactMessagesStore();
  const { data: contactMsg } = useContactMessage(selectedMessageId ?? "");
  const sendEmailMutation = useSendMessageReply();

  const form = useForm<MessageReplyFormValues>({
    resolver: zodResolver(messageReplySchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const { setValue, register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    if (contactMsg) {
      setValue("subject", `Re: ${contactMsg.subject || "Inquiry to Rukn Al Assi"}`);
      setValue(
        "message",
        `Dear ${contactMsg.name},\n\nThank you for contacting Rukn Al Assi.\n\nIn response to your message regarding "${contactMsg.subject || "your inquiry"}":\n\n[Type your response here]\n\nBest regards,\nCustomer Care Team\nRukn Al Assi Co.`
      );
    }
  }, [contactMsg, setValue]);

  if (!selectedMessageId || !contactMsg) return null;

  const onSubmit = async (values: MessageReplyFormValues) => {
    await sendEmailMutation.mutateAsync({
      messageId: contactMsg.id,
      toEmail: contactMsg.email,
      toName: contactMsg.name,
      subject: values.subject,
      message: values.message,
    });
    reset();
    closeEmailModal();
  };

  return (
    <Dialog open={emailModalOpen} onOpenChange={(open) => !open && closeEmailModal()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Send Email Reply to Customer
          </DialogTitle>
          <DialogDescription>
            Send a direct email reply to <span className="font-semibold text-foreground">{contactMsg.name}</span> ({contactMsg.email}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="to">To Email</Label>
            <Input id="to" value={`${contactMsg.name} <${contactMsg.email}>`} disabled className="bg-muted text-xs font-mono" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject *</Label>
            <Input id="subject" {...register("subject")} />
            {errors.subject && <p className="text-xs font-semibold text-destructive">{errors.subject.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Email Message Body *</Label>
            <Textarea id="message" rows={8} {...register("message")} className="text-sm font-sans" />
            {errors.message && <p className="text-xs font-semibold text-destructive">{errors.message.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={closeEmailModal} disabled={sendEmailMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={sendEmailMutation.isPending} className="gap-2 min-w-[130px]">
              {sendEmailMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Email
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
