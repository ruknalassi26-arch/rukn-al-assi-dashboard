"use client";
// ==============================================================================
// features/dashboard/presentation/components/dashboard-tables.tsx
// Tables showing recent RFQs and Contacts for Dashboard
// ==============================================================================
import Link from "next/link";
import { FileText, Mail, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
} from "@shared/ui";
import { useLatestRfqs, useLatestContacts } from "@shared/hooks/dashboard/use-dashboard-hooks";

export function DashboardTables() {
  const { data: rfqs, isLoading: isRfqLoading } = useLatestRfqs(5);
  const { data: contacts, isLoading: isContactLoading } = useLatestContacts(5);

  return (
    <div className="space-y-6">
      {/* RFQ Requests Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-base">Recent RFQ Requests</CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/rfq" className="gap-1 text-xs">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isRfqLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : !rfqs || rfqs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No RFQ requests found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfqs.map((rfq) => (
                  <TableRow key={rfq.id}>
                    <TableCell className="font-medium text-xs">{rfq.fullName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{rfq.companyName ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={rfq.status === "pending" ? "destructive" : "default"}>{rfq.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(rfq.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Contact Messages Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-rose-600" />
            <CardTitle className="text-base">Recent Contact Submissions</CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/contacts" className="gap-1 text-xs">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isContactLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : !contacts || contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No contact messages found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-xs">{c.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{c.subject ?? "General Inquiry"}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === "unread" ? "secondary" : "outline"}>{c.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
