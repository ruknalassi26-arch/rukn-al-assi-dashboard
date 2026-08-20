"use client";
import { useTranslations, useLocale } from "next-intl";
import { User, Mail, Phone, ShieldCheck, Clock, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui";
import type { UserProfileEntity } from "@features/authentication/domain/entities/user-profile.entity";

interface ProfileDetailsCardProps {
  user: UserProfileEntity;
}

export function ProfileDetailsCard({ user }: ProfileDetailsCardProps) {
  const t = useTranslations("profile");
  const locale = useLocale();

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    try {
      const loc = locale === "ar" ? "ar-SA" : locale === "ckb" ? "ar-IQ" : "en-US";
      return new Intl.DateTimeFormat(loc, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
    } catch {
      return d.toLocaleDateString();
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          {t("infoTitle")}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t("infoSubtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="flex items-start gap-3 p-3.5 rounded-lg border bg-muted/30">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground font-medium">{t("fullName")}</span>
              <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
            </div>
          </div>

          {/* Email Address */}
          <div className="flex items-start gap-3 p-3.5 rounded-lg border bg-muted/30">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground font-medium">{t("emailAddress")}</span>
              <p className="text-sm font-semibold text-foreground">{user.email}</p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-start gap-3 p-3.5 rounded-lg border bg-muted/30">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground font-medium">Phone Number</span>
              <p className="text-sm font-semibold text-foreground">
                {user.phone || <span className="text-muted-foreground italic font-normal">Not provided</span>}
              </p>
            </div>
          </div>

          {/* User Role */}
          <div className="flex items-start gap-3 p-3.5 rounded-lg border bg-muted/30">
            <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Role & Permissions</span>
              <div>
                <Badge variant="default" className="text-xs capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Last Login Timestamp */}
          <div className="flex items-start gap-3 p-3.5 rounded-lg border bg-muted/30">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground font-medium">Last Login</span>
              <p className="text-sm font-semibold text-foreground">{formatDate(user.lastLoginAt)}</p>
            </div>
          </div>

          {/* Account Created Date */}
          <div className="flex items-start gap-3 p-3.5 rounded-lg border bg-muted/30">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground font-medium">Account Created Date</span>
              <p className="text-sm font-semibold text-foreground">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Account Status Badge */}
        <div className="pt-2 border-t flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Account Status</span>
          {user.isActive ? (
            <Badge variant="outline" className="gap-1.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Active Account
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1.5 text-xs">
              <XCircle className="h-3.5 w-3.5" />
              Inactive Account
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
