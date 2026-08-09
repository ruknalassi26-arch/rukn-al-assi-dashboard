"use client";
// ==============================================================================
// features/authentication/presentation/components/login-form.tsx
// Admin Login Form Component with Zod + RHF + Sonner Toasts + i18n
// ==============================================================================
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Loader2, LogIn, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Checkbox,
} from "@shared/ui";
import { useSignIn } from "@shared/hooks/auth/use-auth-hooks";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const signInMutation = useSignIn();

  const isDeactivated = searchParams.get("error") === "account_deactivated";
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = z.object({
    email: z.string().email(t("invalidEmail")),
    password: z.string().min(6, t("passwordMinLength")),
    rememberMe: z.boolean(),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const rememberMeValue = watch("rememberMe");

  const onSubmit = async (values: LoginFormValues) => {
    await signInMutation.mutateAsync({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    });
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-primary/10">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 p-2 text-primary shadow-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpg"
            alt="Rukn Al Assi Logo"
            className="h-10 w-10 object-contain rounded-lg"
          />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            {t("subtitle")}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {isDeactivated && (
          <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{t("accountDeactivated")}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              {t("emailLabel")}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
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

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold">
                {t("passwordLabel")}
              </Label>
              <Link
                href={`/${locale}/admin/forgot-password`}
                className="text-xs font-medium text-primary hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                className="pl-9 pr-10 h-10 text-sm"
                autoComplete="current-password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="rememberMe"
              checked={rememberMeValue}
              onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
            />
            <Label
              htmlFor="rememberMe"
              className="text-xs font-normal text-muted-foreground cursor-pointer select-none"
            >
              {t("rememberMe")}
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={signInMutation.isPending}
            className="w-full h-10 font-semibold gap-2 mt-2"
          >
            {signInMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("signingIn")}</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>{t("submit")}</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
