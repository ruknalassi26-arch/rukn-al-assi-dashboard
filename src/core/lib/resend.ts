// ==============================================================================
// core/lib/resend.ts
// Resend email client singleton
// ==============================================================================
import { Resend } from "resend";

/**
 * Singleton Resend client for server-side use only.
 * Never import this in client components.
 */
export const resend = new Resend(process.env["RESEND_API_KEY"]);

export const EMAIL_FROM = `${process.env["RESEND_FROM_NAME"] ?? "Rukn Al Assi"} <${process.env["RESEND_FROM_EMAIL"] ?? "noreply@ruknalassi.com"}>`;
