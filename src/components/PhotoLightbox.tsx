"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";

interface PhotoLightboxProps {
  photos: readonly string[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
  closeLabel: string;
  backLabel: string;
}

export function PhotoLightbox({
  photos,
  index,
  onClose,
  onChange,
  closeLabel,
  backLabel,
}: PhotoLightboxProps) {
  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onChange(index - 1);
  }, [hasPrev, index, onChange]);

  const goNext = useCallback(() => {
    if (hasNext) onChange(index + 1);
  }, [hasNext, index, onChange]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, goPrev, goNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-sky-pale/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={backLabel}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 border border-champagne bg-pearl py-2 pr-5 pl-4 font-body text-xs font-light tracking-[0.15em] text-charcoal uppercase transition-colors hover:bg-linen"
      >
        <span className="text-base leading-none" aria-hidden>
          ←
        </span>
        {backLabel}
      </button>

      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center border border-champagne bg-pearl font-body text-xl font-light text-charcoal/60 transition-colors hover:text-charcoal sm:hidden"
        aria-label={closeLabel}
      >
        ×
      </button>

      {hasPrev && (
        <button
          type="button"
          onClick={goPrev}
          className="absolute top-1/2 left-2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-champagne bg-pearl/90 font-body text-2xl font-light text-charcoal/60 transition-colors hover:text-charcoal sm:left-4"
          aria-label="Previous"
        >
          ‹
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          onClick={goNext}
          className="absolute top-1/2 right-2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-champagne bg-pearl/90 font-body text-2xl font-light text-charcoal/60 transition-colors hover:text-charcoal sm:right-4"
          aria-label="Next"
        >
          ›
        </button>
      )}

      <div className="relative mx-4 mt-10 h-[min(76dvh,720px)] w-full max-w-3xl sm:mx-16">
        <Image
          key={photos[index]}
          src={photos[index]}
          alt=""
          fill
          unoptimized
          priority
          className="animate-fade-in object-contain"
          sizes="100vw"
        />
      </div>

      <p className="absolute bottom-6 font-body text-[10px] font-light tracking-[0.3em] text-charcoal/35">
        {index + 1} / {photos.length}
      </p>
    </div>
  );
}
