"use client";
// ==============================================================================
// features/rfq/presentation/pages/create-rfq-page.tsx
// Dedicated Create RFQ Form Page Component (English Only UI)
// ==============================================================================
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Package,
  Wrench,
  User,
  Phone,
  MapPin,
  Building2,
  Paperclip,
  Upload,
  FileText,
  Save,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@shared/ui";
import { useCreateRfq, useUploadRfqAttachment } from "@shared/hooks/rfq/use-rfq-hooks";
import { useProducts } from "@shared/hooks/products/use-product-hooks";
import { useServices } from "@shared/hooks/services/use-service-hooks";
import { RFQ_STATUS_LABELS } from "../../domain/enums/rfq.enums";
import type { RfqStatus, CreateRfqItemInput, CreateRfqAttachmentInput } from "../../domain/entities/rfq-request.entity";

export function CreateRfqPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const createRfqMutation = useCreateRfq();
  const uploadAttachmentMutation = useUploadRfqAttachment();

  // Load active products and services for dropdown selections
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 100 });
  const { data: servicesData, isLoading: isLoadingServices } = useServices({ limit: 100 });

  const productsList = productsData?.items ?? [];
  const servicesList = servicesData?.items ?? [];

  const getProductName = (p: any): string => {
    if (!p) return "";
    if (p.nameEn) return p.nameEn;
    if (p.nameAr) return p.nameAr;
    if (p.nameKu) return p.nameKu;
    if (p.getTranslation && typeof p.getTranslation === "function") {
      const t = p.getTranslation("en") || p.getTranslation("ar") || p.getTranslation("ku");
      if (t?.name) return t.name;
    }
    if (p.translations) {
      const tName = p.translations.en?.name || p.translations.ar?.name || p.translations.ku?.name;
      if (tName) return tName;
    }
    return p.titleEn || p.title || p.name || p.sku || p.id;
  };

  const getServiceName = (s: any): string => {
    if (!s) return "";
    if (s.nameEn) return s.nameEn;
    if (s.titleEn) return s.titleEn;
    if (s.nameAr) return s.nameAr;
    if (s.nameKu) return s.nameKu;
    if (s.getTranslation && typeof s.getTranslation === "function") {
      const t = s.getTranslation("en") || s.getTranslation("ar") || s.getTranslation("ku");
      if (t?.name) return t.name;
    }
    if (s.translations) {
      const tName = s.translations.en?.name || s.translations.ar?.name || s.translations.ku?.name;
      if (tName) return tName;
    }
    return s.title || s.name || s.id;
  };

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<RfqStatus>("new");

  // Items State
  const [items, setItems] = useState<CreateRfqItemInput[]>([]);

  // Attachments State
  const [attachments, setAttachments] = useState<CreateRfqAttachmentInput[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Validation Error State
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddItem = (type: "product" | "service") => {
    const newItem: CreateRfqItemInput = {
      itemType: type,
      productId: type === "product" && productsList.length > 0 ? productsList[0].id : null,
      serviceId: type === "service" && servicesList.length > 0 ? servicesList[0].id : null,
      quantity: 1,
      notes: "",
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof CreateRfqItemInput, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploaded = await uploadAttachmentMutation.mutateAsync(file);
        setAttachments((prev) => [
          ...prev,
          {
            fileUrl: uploaded.fileUrl,
            fileName: uploaded.fileName,
            mimeType: uploaded.mimeType,
            fileSizeKb: uploaded.fileSizeKb,
          },
        ]);
      }
    } catch {
      // Handled in hook
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (items.length === 0) {
      newErrors.items = "At least one RFQ item (Product or Service) is required";
    } else {
      items.forEach((item, idx) => {
        if (item.itemType === "product" && !item.productId) {
          newErrors[`item_${idx}_id`] = "Please select a product";
        }
        if (item.itemType === "service" && !item.serviceId) {
          newErrors[`item_${idx}_id`] = "Please select a service";
        }
        if (!item.quantity || item.quantity < 1) {
          newErrors[`item_${idx}_qty`] = "Quantity must be at least 1";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createRfqMutation.mutateAsync({
        fullName: fullName.trim(),
        companyName: companyName.trim() || null,
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim() || null,
        status,
        items,
        attachments,
      });

      router.push(`/${locale}/admin/rfq`);
    } catch {
      // Error handled by mutation hook
    }
  };

  const isSubmitting = createRfqMutation.isPending || isUploading;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push(`/${locale}/admin/rfq`)}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to RFQ List
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Create RFQ</h1>
            <p className="text-xs text-muted-foreground">
              Create a new Request for Quotation and assign product or service items.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(`/${locale}/admin/rfq`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save / Create RFQ
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Requester Information */}
        <Card className="border shadow-2xs">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Requester Information
            </CardTitle>
            <CardDescription>
              Enter customer contact details and organization information.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="fullName"
                  placeholder="e.g. Ahmad Hassan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g. Rukn Trading Co."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <Input
                  id="phone"
                  placeholder="e.g. +964 750 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                <Input
                  id="address"
                  placeholder="e.g. Erbil, Industrial Area St 4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={errors.address ? "border-destructive" : ""}
                />
                {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: RFQ Items */}
        <Card className="border shadow-2xs">
          <CardHeader className="border-b bg-muted/20 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                RFQ Items <span className="text-destructive">*</span>
              </CardTitle>
              <CardDescription>
                Select products or services requested by the customer.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddItem("product")}
                className="h-8 text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5 text-blue-500" /> Add Product
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddItem("service")}
                className="h-8 text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5 text-purple-500" /> Add Service
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            {errors.items && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-xs font-semibold">
                {errors.items}
              </div>
            )}

            {items.length === 0 ? (
              <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground text-xs space-y-2">
                <Package className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p className="font-semibold text-sm text-foreground">No items added to this RFQ yet.</p>
                <p>Click "+ Add Product" or "+ Add Service" above to attach items to this request.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 border rounded-lg bg-card space-y-3 relative shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2 border-b pb-2">
                      <Badge variant="outline" className="text-xs capitalize font-medium gap-1.5">
                        {item.itemType === "product" ? (
                          <Package className="h-3.5 w-3.5 text-blue-500" />
                        ) : (
                          <Wrench className="h-3.5 w-3.5 text-purple-500" />
                        )}
                        Item #{idx + 1}: {item.itemType}
                      </Badge>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(idx)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      {/* Product or Service Selector */}
                      <div className="sm:col-span-8 space-y-1.5">
                        <Label className="text-xs">
                          Select {item.itemType === "product" ? "Product" : "Service"} <span className="text-destructive">*</span>
                        </Label>
                        {item.itemType === "product" ? (
                          <Select
                            value={item.productId || ""}
                            onValueChange={(val) => handleItemChange(idx, "productId", val)}
                          >
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Choose product..." />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingProducts ? (
                                <SelectItem value="loading" disabled>Loading products...</SelectItem>
                              ) : productsList.length === 0 ? (
                                <SelectItem value="empty" disabled>No products available</SelectItem>
                              ) : (
                                productsList.map((p: any) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {getProductName(p)}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Select
                            value={item.serviceId || ""}
                            onValueChange={(val) => handleItemChange(idx, "serviceId", val)}
                          >
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Choose service..." />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingServices ? (
                                <SelectItem value="loading" disabled>Loading services...</SelectItem>
                              ) : servicesList.length === 0 ? (
                                <SelectItem value="empty" disabled>No services available</SelectItem>
                              ) : (
                                servicesList.map((s: any) => (
                                  <SelectItem key={s.id} value={s.id}>
                                    {getServiceName(s)}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        )}
                        {errors[`item_${idx}_id`] && (
                          <p className="text-[11px] text-destructive">{errors[`item_${idx}_id`]}</p>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="sm:col-span-4 space-y-1.5">
                        <Label className="text-xs">Quantity <span className="text-destructive">*</span></Label>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", parseInt(e.target.value) || 1)}
                          className="h-9 text-xs"
                        />
                        {errors[`item_${idx}_qty`] && (
                          <p className="text-[11px] text-destructive">{errors[`item_${idx}_qty`]}</p>
                        )}
                      </div>

                      {/* Item Notes */}
                      <div className="sm:col-span-12 space-y-1.5">
                        <Label className="text-xs">Item Notes / Specs (Optional)</Label>
                        <Input
                          placeholder="Item specifications or special requirements..."
                          value={item.notes || ""}
                          onChange={(e) => handleItemChange(idx, "notes", e.target.value)}
                          className="h-9 text-xs bg-muted/10"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: File Attachments */}
        <Card className="border shadow-2xs">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-primary" />
              File Attachments
            </CardTitle>
            <CardDescription>
              Upload drawings, specifications, or documents provided by the client.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Input
                id="fileUpload"
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={isUploading}
                className="cursor-pointer text-xs"
              />
              {isUploading && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" /> Uploading...
                </div>
              )}
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-md border bg-muted/10 text-xs"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-medium truncate">{att.fileName}</span>
                      {att.fileSizeKb && (
                        <span className="text-muted-foreground">({att.fileSizeKb} KB)</span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 4: General Notes & Initial Status */}
        <Card className="border shadow-2xs">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Notes & Status
            </CardTitle>
            <CardDescription>
              Configure initial status and add internal administrative comments.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-1.5">
                <Label htmlFor="rfqStatus">Initial RFQ Status</Label>
                <Select value={status} onValueChange={(val: RfqStatus) => setStatus(val)}>
                  <SelectTrigger id="rfqStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["new", "assigned", "quoted", "won", "lost", "closed"] as RfqStatus[]).map((st) => (
                      <SelectItem key={st} value={st}>
                        {RFQ_STATUS_LABELS[st]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Add internal evaluation comments or customer notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
