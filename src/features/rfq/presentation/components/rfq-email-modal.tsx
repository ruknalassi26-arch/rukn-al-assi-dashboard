"use client";
// ==============================================================================
// features/rfq/presentation/components/rfq-email-modal.tsx
// Email Reply Dialog Component for RFQ Requests
// ==============================================================================
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
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
import { useRfq, useSendEmailReply } from "@shared/hooks/rfq/use-rfq-hooks";

const rfqReplySchema = z.object({
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message body must be at least 10 characters"),
});

export type RfqReplyFormValues = z.infer<typeof rfqReplySchema>;

export function RfqEmailModal() {
  const t = useTranslations("contactAdmin");
  const tCommon = useTranslations("common");
  const { emailModalOpen, selectedRfqId, closeEmailModal } = useRfqStore();
  const { data: rfq } = useRfq(selectedRfqId ?? "");
  const sendEmailMutation = useSendEmailReply();

  const form = useForm<RfqReplyFormValues>({
    resolver: zodResolver(rfqReplySchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const { setValue, register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    if (rfq) {
      setValue("subject", `Quotation Request #${rfq.referenceNumber} - Rukn Al Assi Co.`);
      setValue(
        "message",
        `Dear ${rfq.contactName},\n\nThank you for reaching out to Rukn Al Assi Co. regarding your quotation request.\n\nIn response to your request (Ref: #${rfq.referenceNumber}):\n\n[Type your quotation details / response here]\n\nBest regards,\nSales & Engineering Team\nRukn Al Assi Co.`
      );
    }
  }, [rfq, setValue]);

  if (!selectedRfqId || !rfq) return null;

  const onSubmit = async (values: RfqReplyFormValues) => {
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
            {t("replyModalTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("replyModalSubtitle")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="to">{tCommon("toEmail")}</Label>
            <Input id="to" value={`${rfq.contactName} <${rfq.email}>`} disabled className="bg-muted text-xs font-mono" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">{t("messageSubject")} *</Label>
            <Input id="subject" {...register("subject")} />
            {errors.subject && <p className="text-xs font-semibold text-destructive">{errors.subject.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">{t("messageContent")} *</Label>
            <Textarea id="message" rows={8} {...register("message")} className="text-sm font-sans" />
            {errors.message && <p className="text-xs font-semibold text-destructive">{errors.message.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={closeEmailModal} disabled={sendEmailMutation.isPending}>
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={sendEmailMutation.isPending} className="gap-2 min-w-[130px]">
              {sendEmailMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t("sending")}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> {t("sendReply")}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
