"use client";
// ==============================================================================
// features/languages/presentation/components/language-dialog.tsx
// Dialog for Creating & Updating System Languages & Translation Requirements
// ==============================================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, Globe, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Label,
  Switch,
} from "@shared/ui";
import { useCreateLanguage, useUpdateLanguage } from "@shared/hooks/settings/use-language-hooks";
import type { LanguageEntity } from "../../domain/entities/language.entity";

const languageSchema = z.object({
  code: z.string().min(2, "Language code must be at least 2 characters (e.g. en, ar, ku)").max(10),
  name: z.string().min(2, "English name is required"),
  nativeName: z.string().min(1, "Native name is required"),
  isRtl: z.boolean(),
  isRequired: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

type LanguageFormValues = z.infer<typeof languageSchema>;

interface LanguageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageEntity | null;
}

export function LanguageDialog({ isOpen, onClose, language }: LanguageDialogProps) {
  const tCommon = useTranslations("common");
  const isEditing = !!language;

  const createMutation = useCreateLanguage();
  const updateMutation = useUpdateLanguage();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      code: "",
      name: "",
      nativeName: "",
      isRtl: false,
      isRequired: false,
      isActive: true,
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (language) {
      reset({
        code: language.code,
        name: language.name,
        nativeName: language.nativeName,
        isRtl: language.isRtl,
        isRequired: language.isRequired,
        isActive: language.isActive,
        sortOrder: language.sortOrder,
      });
    } else {
      reset({
        code: "",
        name: "",
        nativeName: "",
        isRtl: false,
        isRequired: false,
        isActive: true,
        sortOrder: 0,
      });
    }
  }, [language, reset]);

  const isRtlValue = watch("isRtl");
  const isRequiredValue = watch("isRequired");
  const isActiveValue = watch("isActive");

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: LanguageFormValues) => {
    if (isEditing && language) {
      await updateMutation.mutateAsync({
        code: language.code,
        input: {
          name: values.name,
          nativeName: values.nativeName,
          isRtl: values.isRtl,
          isRequired: values.isRequired,
          isActive: values.isActive,
          sortOrder: values.sortOrder,
        },
      });
    } else {
      await createMutation.mutateAsync(values);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {isEditing ? "Edit Language" : "Add New Language"}
          </DialogTitle>
          <DialogDescription>
            Configure system language code, native script, direction, and mandatory translation settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* ISO Code */}
          <div className="space-y-1.5">
            <Label htmlFor="code">Language Code (ISO) *</Label>
            <Input
              id="code"
              disabled={isEditing}
              {...register("code")}
              placeholder="e.g. ar, en, ku, fr"
            />
            {errors.code && <span className="text-xs text-destructive">{errors.code.message}</span>}
            {isEditing && <p className="text-[11px] text-muted-foreground">Primary key code cannot be modified once created.</p>}
          </div>

          {/* Name in English */}
          <div className="space-y-1.5">
            <Label htmlFor="name">English Display Name *</Label>
            <Input id="name" {...register("name")} placeholder="e.g. Arabic, Kurdish" />
            {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
          </div>

          {/* Native Name */}
          <div className="space-y-1.5">
            <Label htmlFor="nativeName">Native Name (Native Script) *</Label>
            <Input id="nativeName" {...register("nativeName")} placeholder="e.g. العربية, کوردی" />
            {errors.nativeName && <span className="text-xs text-destructive">{errors.nativeName.message}</span>}
          </div>

          {/* Sort Order */}
          <div className="space-y-1.5">
            <Label htmlFor="sortOrder">Sort / Display Order</Label>
            <Input
              id="sortOrder"
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
            />
          </div>

          {/* Switches */}
          <div className="space-y-3 pt-2 border-t">
            {/* Is Required */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isRequired" className="text-sm font-medium">
                  Mandatory Translation (Required)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Mark whether content translations in this language are mandatory before publishing.
                </p>
              </div>
              <Switch
                id="isRequired"
                checked={isRequiredValue}
                onCheckedChange={(checked) => setValue("isRequired", checked)}
              />
            </div>

            {/* Is RTL */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isRtl" className="text-sm font-medium">
                  Right-to-Left Layout (RTL)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable for languages written from right to left (e.g. Arabic, Kurdish, Persian).
                </p>
              </div>
              <Switch
                id="isRtl"
                checked={isRtlValue}
                onCheckedChange={(checked) => setValue("isRtl", checked)}
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  Active Status
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable language to be accessible on public website forms and menus.
                </p>
              </div>
              <Switch
                id="isActive"
                checked={isActiveValue}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
