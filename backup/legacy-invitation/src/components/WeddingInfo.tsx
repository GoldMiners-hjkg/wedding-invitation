"use client";

import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";
import { CoupleNames } from "./CoupleNames";
import { EditorialSectionHeader } from "@/components/editorial/motifs";
import { useLanguage } from "@/lib/i18n/context";
import { MEDIA, HOTEL } from "@/lib/wedding";

export function WeddingInfo() {
  const { t } = useLanguage();
  const { wedding, info } = t;

  return (
    <section className="relative px-6 pt-10 pb-20 sm:px-10 sm:pt-12 sm:pb-24">
      <ScrollReveal>
        <EditorialSectionHeader className="mx-auto max-w-lg vintage-text-halo">
          <p className="text-eyebrow">{info.families}</p>
          <CoupleNames size="large" theme="light" className="mt-3" />
          <p className="text-body-vintage mt-6">{info.request}</p>
        </EditorialSectionHeader>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="mx-auto mt-14 grid max-w-lg grid-cols-2 gap-3">
          {MEDIA.hotelPhotos.map((src, index) => (
            <div
              key={src}
              className={`relative overflow-hidden border border-wine/15 shadow-[0_8px_32px_rgba(68,68,68,0.06)] ${
                index === 0 ? "aspect-[4/5]" : "aspect-[4/5] sm:mt-8"
              }`}
            >
              <Image
                src={src}
                alt={`${wedding.venue} ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 512px) 50vw, 256px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/20 to-transparent" />
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="mx-auto mt-10 max-w-lg text-center vintage-text-halo">
          <p className="text-eyebrow">{info.where}</p>
          <p className="mt-4 font-heading text-xl text-wine">
            {wedding.venue}
          </p>
          <p className="text-body-vintage mt-2">
            <a
              href={HOTEL.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-wine/30 underline-offset-2 hover:text-wine-light"
            >
              {wedding.venueAddress}
            </a>
          </p>
          <p className="text-caption-vintage mt-3">{wedding.venueDetail}</p>
        </div>
      </ScrollReveal>
    </section>
  );
}
