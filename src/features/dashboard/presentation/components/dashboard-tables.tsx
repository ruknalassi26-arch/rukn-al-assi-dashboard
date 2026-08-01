"use client";
// ==============================================================================
// features/dashboard/presentation/components/dashboard-tables.tsx
// Tables for Recent RFQs & Recent Contact Messages
// ==============================================================================
import Link from "next/link";
import { useLocale } from "next-intl";
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

  const { data: rfqs, isLoading: isRfqLoading, error: rfqError, refetch: refetchRfqs } = useLatestRfqs(5);
  const { data: contacts, isLoading: isContactLoading, error: contactError, refetch: refetchContacts } = useLatestContacts(5);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "new":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">New</Badge>;
      case "reviewed":
      case "read":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">Read</Badge>;
      case "replied":
      case "quoted":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Replied</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date));
  };

  return (
    <Card className="border shadow-sm">
      <Tabs defaultValue="rfqs" className="w-full">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Inbox className="h-4 w-4 text-primary" />
              Customer Requests & Inquiries
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Review latest quotation requests and customer message submissions.
            </CardDescription>
          </div>

          <TabsList className="grid grid-cols-2 w-full sm:w-auto h-9 p-1 bg-muted/60 rounded-lg">
            <TabsTrigger value="rfqs" className="gap-1.5 text-xs py-1">
              <FileText className="h-3.5 w-3.5" />
              Recent RFQs
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-1.5 text-xs py-1">
              <Mail className="h-3.5 w-3.5" />
              Contact Messages
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
              <ErrorState title="Failed to load RFQs" error={rfqError} onRetry={() => refetchRfqs()} />
            ) : !rfqs || rfqs.length === 0 ? (
              <div className="text-center py-10 space-y-2 border border-dashed rounded-lg bg-muted/20">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p className="text-xs font-semibold text-muted-foreground">No Quotation Requests Found</p>
                <p className="text-[11px] text-muted-foreground/80">New RFQ submissions from the website will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[11px]">Customer</TableHead>
                        <TableHead className="text-[11px]">Company</TableHead>
                        <TableHead className="text-[11px]">Status</TableHead>
                        <TableHead className="text-[11px] text-end">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rfqs.map((rfq) => (
                        <TableRow key={rfq.id} className="text-xs hover:bg-muted/40">
                          <TableCell className="font-semibold text-foreground py-2.5">
                            <div>
                              <p className="truncate max-w-[150px]">{rfq.fullName}</p>
                              <p className="text-[10px] text-muted-foreground font-normal truncate">{rfq.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground py-2.5">
                            {rfq.companyName || "N/A"}
                          </TableCell>
                          <TableCell className="py-2.5">{getStatusBadge(rfq.status)}</TableCell>
                          <TableCell className="text-end text-[11px] text-muted-foreground py-2.5 whitespace-nowrap">
                            {formatDate(rfq.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href={`/${locale}/admin/rfq`}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View All RFQs</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Recent Contact Messages */}
          <TabsContent value="contacts" className="mt-0">
            {isContactLoading ? (
              <div className="space-y-3 py-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            ) : contactError ? (
              <ErrorState title="Failed to load contact messages" error={contactError} onRetry={() => refetchContacts()} />
            ) : !contacts || contacts.length === 0 ? (
              <div className="text-center py-10 space-y-2 border border-dashed rounded-lg bg-muted/20">
                <Mail className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p className="text-xs font-semibold text-muted-foreground">No Contact Messages Found</p>
                <p className="text-[11px] text-muted-foreground/80">Direct customer inbox messages will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[11px]">Sender</TableHead>
                        <TableHead className="text-[11px]">Subject</TableHead>
                        <TableHead className="text-[11px]">Status</TableHead>
                        <TableHead className="text-[11px] text-end">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id} className="text-xs hover:bg-muted/40">
                          <TableCell className="font-semibold text-foreground py-2.5">
                            <div>
                              <p className="truncate max-w-[150px]">{contact.name}</p>
                              <p className="text-[10px] text-muted-foreground font-normal truncate">{contact.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground py-2.5 truncate max-w-[180px]">
                            {contact.subject || "General Inquiry"}
                          </TableCell>
                          <TableCell className="py-2.5">{getStatusBadge(contact.status)}</TableCell>
                          <TableCell className="text-end text-[11px] text-muted-foreground py-2.5 whitespace-nowrap">
                            {formatDate(contact.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href={`/${locale}/admin/contact-messages`}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View All Messages</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
