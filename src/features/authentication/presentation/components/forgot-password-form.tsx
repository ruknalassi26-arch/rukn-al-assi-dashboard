"use client";
// ==============================================================================
// features/authentication/presentation/components/forgot-password-form.tsx
// Forgot Password Form Component
// ==============================================================================
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
} from "@shared/ui";
import { useSendPasswordReset } from "@shared/hooks/auth/use-auth-hooks";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");
  const locale = useLocale();
  const sendResetMutation = useSendPasswordReset();

  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    await sendResetMutation.mutateAsync({ email: values.email });
    setSubmittedEmail(values.email);
  };

  if (submittedEmail) {
    return (
      <Card className="w-full max-w-md shadow-xl border-primary/10 text-center">
        <CardHeader className="space-y-3 pb-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl font-bold text-foreground">
            {t("successTitle")}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {t("successMessage")}{" "}
            <span className="font-semibold text-foreground">{submittedEmail}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Link href={`/${locale}/admin/login`}>
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>{t("backToLogin")}</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-primary/10">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              {t("emailLabel")}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@ruknalassi.com"
                className="pl-9 h-10 text-sm"
                autoComplete="email"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={sendResetMutation.isPending}
            className="w-full h-10 font-semibold gap-2 mt-2"
          >
            {sendResetMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("sending")}</span>
              </>
            ) : (
              <span>{t("submit")}</span>
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              href={`/${locale}/admin/login`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t("backToLogin")}</span>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
