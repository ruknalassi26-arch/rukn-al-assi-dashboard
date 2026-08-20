"use client";
// ==============================================================================
// features/dashboard/presentation/components/dashboard-tables.tsx
// Tables for Recent RFQs & Recent Contact Messages
// ==============================================================================
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FileText, Mail, ArrowUpRight, Inbox } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shared/ui";
import { useLatestRfqs, useLatestContacts } from "@shared/hooks/dashboard/use-dashboard-hooks";
import { ErrorState } from "@shared/components/error-state";

export function DashboardTables() {
  const locale = useLocale();
  const tRfq = useTranslations("dashboard.rfqTable");
  const tContact = useTranslations("dashboard.contactTable");
  const tCommon = useTranslations("common");

  const { data: rfqs, isLoading: isRfqLoading, error: rfqError, refetch: refetchRfqs } = useLatestRfqs(5);
  const { data: contacts, isLoading: isContactLoading, error: contactError, refetch: refetchContacts } = useLatestContacts(5);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "new":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">{tCommon("all")}</Badge>;
      case "reviewed":
      case "read":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">{tCommon("completed")}</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">{status}</Badge>;
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    const loc = locale === "ar" ? "ar-SA" : locale === "ckb" ? "ar-IQ" : "en-US";
    try {
      return new Intl.DateTimeFormat(loc, {
        dateStyle: "short",
        timeStyle: "short",
      }).format(d);
    } catch {
      return d.toLocaleDateString();
    }
  };

  return (
    <Card className="border shadow-sm">
      <Tabs defaultValue="rfqs" className="w-full">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Inbox className="h-4 w-4 text-primary" />
              {tRfq("title")}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {tRfq("emptyDescription")}
            </CardDescription>
          </div>

          <TabsList className="grid grid-cols-2 w-full sm:w-auto h-9 p-1 bg-muted/60 rounded-lg">
            <TabsTrigger value="rfqs" className="gap-1.5 text-xs py-1">
              <FileText className="h-3.5 w-3.5" />
              {tRfq("title")}
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-1.5 text-xs py-1">
              <Mail className="h-3.5 w-3.5" />
              {tContact("title")}
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Tab 1: Recent RFQs */}
          <TabsContent value="rfqs" className="mt-0">
            {isRfqLoading ? (
              <div className="space-y-3 py-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            ) : rfqError ? (
              <ErrorState title={tRfq("errorTitle")} error={rfqError} onRetry={() => refetchRfqs()} />
            ) : !rfqs || rfqs.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">{tRfq("emptyTitle")}</p>
                <p className="text-xs text-muted-foreground">{tRfq("emptyDescription")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{tRfq("customer")}</TableHead>
                      <TableHead className="text-xs">{tRfq("email")}</TableHead>
                      <TableHead className="text-xs">{tRfq("status")}</TableHead>
                      <TableHead className="text-xs text-end">{tRfq("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rfqs.map((rfq) => (
                      <TableRow key={rfq.id}>
                        <TableCell className="font-medium text-xs">
                          {rfq.fullName}
                          {rfq.companyName && <span className="block text-[11px] text-muted-foreground">{rfq.companyName}</span>}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{rfq.email}</TableCell>
                        <TableCell>{getStatusBadge(rfq.status)}</TableCell>
                        <TableCell className="text-end">
                          <Link href={`/${locale}/admin/rfq?id=${rfq.id}`} className="text-primary hover:underline text-xs inline-flex items-center gap-1">
                            {tRfq("view")} <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Recent Contacts */}
          <TabsContent value="contacts" className="mt-0">
            {isContactLoading ? (
              <div className="space-y-3 py-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            ) : contactError ? (
              <ErrorState title={tContact("errorTitle")} error={contactError} onRetry={() => refetchContacts()} />
            ) : !contacts || contacts.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">{tContact("emptyTitle")}</p>
                <p className="text-xs text-muted-foreground">{tContact("emptyDescription")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{tContact("name")}</TableHead>
                      <TableHead className="text-xs">{tContact("subject")}</TableHead>
                      <TableHead className="text-xs">{tContact("status")}</TableHead>
                      <TableHead className="text-xs text-end">{tContact("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium text-xs">
                          {c.name}
                          <span className="block text-[11px] text-muted-foreground">{c.email}</span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">{c.subject || "-"}</TableCell>
                        <TableCell>{getStatusBadge(c.status)}</TableCell>
                        <TableCell className="text-end">
                          <Link href={`/${locale}/admin/contact-messages?id=${c.id}`} className="text-primary hover:underline text-xs inline-flex items-center gap-1">
                            {tContact("view")} <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
