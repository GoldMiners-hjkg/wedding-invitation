"use client";

import { useCallback, useState } from "react";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { ScatteredPhotoTable } from "@/components/ScatteredPhotoTable";
import { VintageShell } from "@/components/VintageShell";
import { useLanguage } from "@/lib/i18n/context";
import { MEDIA } from "@/lib/wedding";

interface TransitionScreenProps {
  onContinue: () => void;
}

export function TransitionScreen({ onContinue }: TransitionScreenProps) {
  const { t } = useLanguage();
  const photos = MEDIA.transitionGallery;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openPhoto = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  return (
    <VintageShell>
      <section className="relative flex h-[100dvh] w-full flex-col overflow-hidden pt-[env(safe-area-inset-top)] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="min-h-0 flex-1" aria-hidden />

        <div className="flex shrink-0 flex-col items-center px-3">
          <ScatteredPhotoTable
            photos={photos}
            onOpen={openPhoto}
            className="relative mx-auto h-[min(54dvh,440px)] w-[min(92vw,400px)] touch-pan-y"
          />
          <div className="h-16 shrink-0" aria-hidden />
          <button
            type="button"
            onClick={onContinue}
            className="relative z-20 shrink-0 border border-wine/40 px-10 py-3.5 font-body text-[11px] font-medium tracking-[0.22em] text-wine-deep uppercase vintage-text-halo transition-all hover:border-wine/55 active:scale-[0.98]"
          >
            {t.transition.continue}
          </button>
        </div>

        <div className="min-h-0 flex-1" aria-hidden />

        {lightboxIndex !== null && (
          <PhotoLightbox
            photos={photos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onChange={setLightboxIndex}
            closeLabel={t.transition.close}
            backLabel={t.transition.back}
          />
        )}
      </section>
    </VintageShell>
  );
}
