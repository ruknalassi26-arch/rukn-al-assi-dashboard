"use client";
// ==============================================================================
// features/team/presentation/components/team-member-details-drawer.tsx
// Team Member Preview & Details Sheet Component
// ==============================================================================
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Edit, Mail, Phone, Globe, Briefcase, Layers } from "lucide-react";
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
import { useTeamStore } from "../stores/team.store";
import { useTeamMember } from "@shared/hooks/team/use-team-hooks";

export function TeamMemberDetailsDrawer() {
  const { drawerOpen, selectedMemberId, closeDrawer } = useTeamStore();
  const { data: member, isLoading } = useTeamMember(selectedMemberId ?? "");

  if (!selectedMemberId) return null;

  return (
    <Dialog open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-lg font-bold">
              <Users className="h-5 w-5 text-primary" />
              <span>Team Member Details</span>
            </div>
            {member && (
              <Link href={`/admin/team/edit/${member.id}`} onClick={() => closeDrawer()}>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Edit className="h-4 w-4" /> Edit Profile
                </Button>
              </Link>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : member ? (
          <div className="space-y-6 py-2">
            {/* Header Photo & Identity */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {member.photo ? (
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 shadow-md">
                  <Image
                    src={member.photo}
                    alt={member.fullNameEn}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border bg-muted/40 text-muted-foreground">
                  <Users className="h-12 w-12" />
                </div>
              )}

              <div className="space-y-1.5 text-center sm:text-left w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{member.fullNameEn}</h3>
                  <Badge variant={member.isActive ? "default" : "secondary"}>
                    {member.status}
                  </Badge>
                </div>
                <p className="text-base font-semibold text-primary" dir="rtl">
                  {member.fullNameAr}
                </p>
                {member.fullNameKu && (
                  <p className="text-sm font-medium text-muted-foreground" dir="rtl">
                    ☀️ {member.fullNameKu}
                  </p>
                )}
                <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{member.positionEn ?? "N/A"}</span>
                  {member.departmentEn && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
                      {member.departmentEn}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Email:</span>
                <span>{member.email ?? "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Phone:</span>
                <span>{member.phone ?? "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">LinkedIn:</span>
                {member.linkedin ? (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary underline truncate">
                    {member.linkedin}
                  </a>
                ) : (
                  <span>N/A</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Sort Order:</span>
                <span>{member.sortOrder}</span>
              </div>
            </div>

            <Separator />

            {/* Biographies */}
            <div className="space-y-4">
              {member.biographyEn && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Biography (English)</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{member.biographyEn}</p>
                </div>
              )}
              {member.biographyAr && (
                <div className="space-y-1" dir="rtl">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">السيرة الذاتية (بالعربية)</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{member.biographyAr}</p>
                </div>
              )}
              {member.biographyKu && (
                <div className="space-y-1" dir="rtl">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">ژیاننامە (بە کوردی)</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{member.biographyKu}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Team member not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
