"use client";
// ==============================================================================
// features/homepage/presentation/components/hero-preview-dialog.tsx
// Live website preview for a hero slide
// ==============================================================================
import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@shared/ui";
import type { HeroSlideEntity } from "../../domain/entities/homepage.entity";

interface HeroPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slide: HeroSlideEntity | null;
}

export function HeroPreviewDialog({ isOpen, onClose, slide }: HeroPreviewDialogProps) {
  const [lang, setLang] = useState<"en" | "ar">("en");

  if (!slide) return null;

  const isAr = lang === "ar";
  const title = isAr ? slide.titleAr : slide.titleEn;
  const subtitle = isAr ? slide.subtitleAr : slide.subtitleEn;
  const primaryBtn = isAr ? slide.primaryButtonTextAr : slide.primaryButtonTextEn;
  const secondaryBtn = isAr ? slide.secondaryButtonTextAr : slide.secondaryButtonTextEn;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-card flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-semibold">Hero Slide Preview</DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={lang === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLang("en")}
            >
              English
            </Button>
            <Button
              variant={lang === "ar" ? "default" : "outline"}
              size="sm"
              onClick={() => setLang("ar")}
            >
              العربية
            </Button>
          </div>
        </DialogHeader>

        {/* Hero Section Live Simulation */}
        <div
          dir={isAr ? "rtl" : "ltr"}
          className="relative min-h-[420px] flex flex-col justify-center px-8 md:px-16 py-12 text-white bg-slate-900 overflow-hidden"
        >
          {/* Background image & overlay */}
          {slide.backgroundImage && (
            <Image
              src={slide.backgroundImage}
              alt="Hero Preview Background"
              fill
              className="object-cover"
            />
          )}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: slide.overlayOpacity }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-2xl space-y-4">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {title || "Hero Title"}
            </h1>
            {subtitle && (
              <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-light">
                {subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-4">
              {primaryBtn && (
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg hover:bg-primary/90 transition-all"
                >
                  {primaryBtn}
                </button>
              )}
              {secondaryBtn && (
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
                >
                  {secondaryBtn}
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
