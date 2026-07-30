"use client";
// ==============================================================================
// features/contact/presentation/components/branch-details-drawer.tsx
// Branch Preview & Details Sheet Component
// ==============================================================================
import React from "react";
import Link from "next/link";
import { Building2, Edit, Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Badge,
  Skeleton,
  Separator,
} from "@shared/ui";
import { useContactStore } from "../stores/contact.store";
import { useBranch } from "@shared/hooks/contact/use-contact-hooks";

export function BranchDetailsDrawer() {
  const { drawerOpen, selectedBranchId, closeDrawer } = useContactStore();
  const { data: branch, isLoading } = useBranch(selectedBranchId ?? "");

  if (!selectedBranchId) return null;

  return (
    <Dialog open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-lg font-bold">
              <Building2 className="h-5 w-5 text-primary" />
              <span>Branch Details</span>
            </div>
            {branch && (
              <Link href={`/admin/contact/branches/edit/${branch.id}`} onClick={() => closeDrawer()}>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Edit className="h-4 w-4" /> Edit Branch
                </Button>
              </Link>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : branch ? (
          <div className="space-y-6 py-2">
            {/* Header Identity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{branch.nameEn}</h3>
                  {branch.isHeadquarters && (
                    <Badge variant="default" className="bg-amber-500">
                      Headquarters
                    </Badge>
                  )}
                </div>
                <Badge variant={branch.isActive ? "default" : "secondary"}>
                  {branch.status}
                </Badge>
              </div>
              <p className="text-base font-semibold text-primary" dir="rtl">
                {branch.nameAr}
              </p>
              {branch.nameKu && (
                <p className="text-sm font-medium text-muted-foreground" dir="rtl">
                  ☀️ {branch.nameKu}
                </p>
              )}
            </div>

            <Separator />

            {/* Contact & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Email:</span>
                <span>{branch.email ?? "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Phone:</span>
                <span>{branch.phone ?? "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">City:</span>
                <span>{branch.cityEn ?? "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Working Hours:</span>
                <span>{branch.workingHoursEn ?? "N/A"}</span>
              </div>
            </div>

            <Separator />

            {/* Addresses */}
            <div className="space-y-4">
              {branch.addressEn && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Address (English)</h4>
                  <p className="text-sm text-foreground/90">{branch.addressEn}</p>
                </div>
              )}
              {branch.addressAr && (
                <div className="space-y-1" dir="rtl">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">العنوان (بالعربية)</h4>
                  <p className="text-sm text-foreground/90">{branch.addressAr}</p>
                </div>
              )}
              {branch.addressKu && (
                <div className="space-y-1" dir="rtl">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">ناونیشان (بە کوردی)</h4>
                  <p className="text-sm text-foreground/90">{branch.addressKu}</p>
                </div>
              )}

              {branch.googleMapsUrl && (
                <div className="pt-2">
                  <a
                    href={branch.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open Google Maps Link
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Branch not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
