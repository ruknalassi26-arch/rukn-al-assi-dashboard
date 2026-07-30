// ==============================================================================
// core/services/email.service.ts
// Resend email service — server-side only
// ==============================================================================
import { resend, EMAIL_FROM } from "@core/lib/resend";
import type { CreateEmailOptions } from "resend";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  /** Raw HTML string — use React Email for structured templates */
  html?: string;
  /** Plain text fallback */
  text?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Sends a transactional email via Resend.
 * Use React Email components to build `html` templates.
 *
 * @example
 *   const result = await EmailService.send({
 *     to: "client@example.com",
 *     subject: "Your RFQ has been received",
 *     html: "<p>We will get back to you shortly.</p>",
 *   });
 */
export class EmailService {
  static async send(options: SendEmailOptions): Promise<EmailResult> {
    try {
      const recipient = Array.isArray(options.to) ? options.to : [options.to];

      const emailPayload: CreateEmailOptions = {
        from: EMAIL_FROM,
        to: recipient,
        subject: options.subject,
        ...(options.html ? { html: options.html } : {}),
        ...(options.text ? { text: options.text } : {}),
        ...(options.replyTo ? { replyTo: options.replyTo } : {}),
      } as CreateEmailOptions;

      const { data, error } = await resend.emails.send(emailPayload);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, id: data?.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send email";
      return { success: false, error: message };
    }
  }
}
