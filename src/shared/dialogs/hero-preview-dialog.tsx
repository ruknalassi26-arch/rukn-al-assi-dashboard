"use client";
// ==============================================================================
// shared/dialogs/hero-preview-dialog.tsx
// Interactive live preview modal for Hero Slides
// ==============================================================================
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, Button, Badge } from "@shared/ui";
import type { HeroSlideEntity } from "@features/homepage/domain/entities/homepage.entity";

interface HeroPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slides: HeroSlideEntity[];
}

export function HeroPreviewDialog({ isOpen, onClose, slides }: HeroPreviewDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!slides || slides.length === 0) return null;
  const currentSlide = slides[currentIndex] || slides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black text-white border-0">
        <div className="relative h-[480px] w-full flex items-center justify-center">
          {/* Background Image */}
          {currentSlide.backgroundImage ? (
            <Image
              src={currentSlide.backgroundImage}
              alt={currentSlide.titleEn}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900" />
          )}

          {/* Dark Overlay */}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: (currentSlide.overlayOpacity ?? 40) / 100 }}
          />

          {/* Slide Content */}
          <div className="relative z-10 text-center max-w-2xl px-6 space-y-4">
            <Badge variant="outline" className="text-white border-white/40 mb-2">
              Slide {currentIndex + 1} of {slides.length}
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
              {currentSlide.titleEn}
            </h2>
            {currentSlide.subtitleEn && (
              <p className="text-base sm:text-lg text-gray-200 drop-shadow">
                {currentSlide.subtitleEn}
              </p>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              {currentSlide.primaryButtonTextEn && (
                <Button className="bg-primary text-primary-foreground font-semibold px-6">
                  {currentSlide.primaryButtonTextEn}
                </Button>
              )}
              {currentSlide.secondaryButtonTextEn && (
                <Button variant="outline" className="border-white text-white hover:bg-white/20">
                  {currentSlide.secondaryButtonTextEn}
                </Button>
              )}
            </div>
          </div>

          {/* Slider Controls */}
          {slides.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/80"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/80"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-black/50 text-white hover:bg-black/80 z-20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
