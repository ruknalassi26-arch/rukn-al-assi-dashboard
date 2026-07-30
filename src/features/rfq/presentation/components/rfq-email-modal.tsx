"use client";
// ==============================================================================
// features/rfq/presentation/components/rfq-email-modal.tsx
// Email Reply Dialog Component for RFQ Requests
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
import { useRfqStore } from "../stores/rfq.store";
import { useRfq as useRfqQuery, useSendEmailReply as useSendEmailReplyMutation } from "@shared/hooks/rfq/use-rfq-hooks";

const emailReplySchema = z.object({
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message body must be at least 10 characters"),
});

export type EmailReplyFormValues = z.infer<typeof emailReplySchema>;

export function RfqEmailModal() {
  const { emailModalOpen, selectedRfqId, closeEmailModal } = useRfqStore();
  const { data: rfq } = useRfqQuery(selectedRfqId ?? "");
  const sendEmailMutation = useSendEmailReplyMutation();

  const form = useForm<EmailReplyFormValues>({
    resolver: zodResolver(emailReplySchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const { setValue, register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    if (rfq) {
      setValue("subject", `Quotation Response: RFQ #${rfq.referenceNumber} - Rukn Al Assi`);
      setValue(
        "message",
        `Dear ${rfq.contactName},\n\nThank you for reaching out to Rukn Al Assi regarding your quotation request (#${rfq.referenceNumber}) for ${rfq.productName ?? "our products/services"}.\n\nWe are pleased to provide you with the following quotation details...\n\nBest regards,\nSales & Engineering Team\nRukn Al Assi Co.`
      );
    }
  }, [rfq, setValue]);

  if (!selectedRfqId || !rfq) return null;

  const onSubmit = async (values: EmailReplyFormValues) => {
    await sendEmailMutation.mutateAsync({
      rfqId: rfq.id,
      toEmail: rfq.email,
      toName: rfq.contactName,
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
            Send an official email quotation response to <span className="font-semibold text-foreground">{rfq.contactName}</span> ({rfq.email}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="to">To Email</Label>
            <Input id="to" value={`${rfq.contactName} <${rfq.email}>`} disabled className="bg-muted text-xs font-mono" />
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
