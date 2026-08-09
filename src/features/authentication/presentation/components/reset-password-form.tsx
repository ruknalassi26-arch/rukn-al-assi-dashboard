"use client";
// ==============================================================================
// features/authentication/presentation/components/reset-password-form.tsx
// Reset Password Form Component
// ==============================================================================
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Lock, Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
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
import { useResetPassword } from "@shared/hooks/auth/use-auth-hooks";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword");
  const resetPasswordMutation = useResetPassword();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate({ newPassword: values.newPassword });
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-primary/10">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
          <KeyRound className="h-6 w-6 text-primary" />
          <span>{t("title")}</span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-xs font-semibold">
              {t("newPasswordLabel")}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-9 pr-10 h-10 text-sm"
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs font-medium text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold">
              {t("confirmPasswordLabel")}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-9 pr-10 h-10 text-sm"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full h-10 font-semibold gap-2 mt-2"
          >
            {resetPasswordMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("updating")}</span>
              </>
            ) : (
              <span>{t("submit")}</span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
