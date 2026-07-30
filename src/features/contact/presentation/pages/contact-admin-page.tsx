"use client";
// ==============================================================================
// features/contact/presentation/pages/contact-admin-page.tsx
// Main Contact Management Page (Tabbed: Contact Info & Branches)
// ==============================================================================
import React from "react";
import { Phone, Building2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shared/ui";
import { ContactInfoForm } from "../components/contact-info-form";
import { BranchTable } from "../components/branch-table";
import { BranchDetailsDrawer } from "../components/branch-details-drawer";
import { useContactStore } from "../stores/contact.store";

export function ContactAdminPage() {
  const { activeTab, setActiveTab } = useContactStore();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "info" | "branches")} className="space-y-6">
        <TabsList className="grid w-full max-w-[360px] grid-cols-2 h-10 p-1 bg-muted/60 border rounded-lg">
          <TabsTrigger value="info" className="gap-2 text-xs font-semibold">
            <Phone className="h-4 w-4" /> Contact Information
          </TabsTrigger>
          <TabsTrigger value="branches" className="gap-2 text-xs font-semibold">
            <Building2 className="h-4 w-4" /> Company Branches
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="focus-visible:outline-none">
          <ContactInfoForm />
        </TabsContent>

        <TabsContent value="branches" className="focus-visible:outline-none">
          <BranchTable />
        </TabsContent>
      </Tabs>

      <BranchDetailsDrawer />
    </div>
  );
}
