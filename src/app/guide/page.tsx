"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Footer } from "@/components/Footer";
import {
  EditorialSectionHeader,
  HorizonLine,
} from "@/components/editorial/motifs";
import { DividerOrnament } from "@/components/editorial/Ornaments";
import { useLanguage } from "@/lib/i18n/context";
import { MEDIA } from "@/lib/wedding";
import type { GuideItem } from "@/lib/i18n/types";

function GuideCard({
  item,
  imageSrc,
}: {
  item: GuideItem;
  imageSrc?: string;
}) {
  return (
    <div className="overflow-hidden border border-champagne/35 bg-pearl/80 transition-colors hover:border-mist/40">
      {imageSrc && (
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={imageSrc}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {!imageSrc && (
            <span className="text-xl opacity-60" aria-hidden>
              {item.icon}
            </span>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading text-xl text-charcoal italic">
                {item.name}
              </h3>
              <span className="border border-champagne/50 px-2.5 py-0.5 font-body text-[9px] font-light tracking-widest text-charcoal/45 uppercase">
                {item.tag}
              </span>
            </div>
            <p className="mt-2 font-body text-sm font-light leading-relaxed text-charcoal/55">
              {item.description}
            </p>
            {item.tip && (
              <p className="mt-2 font-body text-xs font-light text-charcoal/45">
                {item.tip}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const FOOD_IMAGES = [MEDIA.guideFood, null, null, null, null] as const;
const FUN_IMAGES = [MEDIA.guideFun, null, null, null, null] as const;

export default function GuidePage() {
  const { t } = useLanguage();
  const { guide } = t;

  return (
    <main className="min-h-dvh paper-linen">
      <section className="relative overflow-hidden px-6 pb-14 pt-20 sm:px-10">
        <Image
          src={MEDIA.heroImage}
          alt=""
          fill
          className="object-cover opacity-20 brightness-110 saturate-[0.85]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pearl/70 via-pearl/85 to-pearl" />

        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-lg text-center">
            <Link
              href="/"
              className="inline-block font-body text-[11px] font-light tracking-[0.18em] text-charcoal/45 uppercase transition-colors hover:text-charcoal"
            >
              {guide.backHome}
            </Link>
            <EditorialSectionHeader className="mt-10">
              <p className="font-body text-[10px] font-light tracking-[0.35em] text-charcoal/45 uppercase">
                {guide.subtitle}
              </p>
              <h1 className="mt-3 font-heading text-4xl text-charcoal italic sm:text-5xl">
                {guide.title}
              </h1>
            </EditorialSectionHeader>
            <p className="mt-4 font-body text-sm font-light leading-relaxed text-charcoal/55">
              {guide.intro}
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-ivory-soft px-6 py-16 sm:px-10">
        <ScrollReveal>
          <div className="mx-auto max-w-lg">
            <DividerOrnament className="mb-6" />
            <h2 className="font-heading text-3xl text-charcoal italic">
              {guide.foodTitle}
            </h2>
            <p className="mt-2 font-body text-sm font-light text-charcoal/50">
              {guide.foodIntro}
            </p>
            <div className="mt-8 space-y-4">
              {guide.food.map((item, i) => (
                <GuideCard
                  key={item.name}
                  item={item}
                  imageSrc={FOOD_IMAGES[i] ?? undefined}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-linen px-6 py-16 sm:px-10">
        <ScrollReveal>
          <div className="mx-auto max-w-lg">
            <DividerOrnament className="mb-6" />
            <h2 className="font-heading text-3xl text-charcoal italic">
              {guide.funTitle}
            </h2>
            <p className="mt-2 font-body text-sm font-light text-charcoal/50">
              {guide.funIntro}
            </p>
            <div className="mt-8 space-y-4">
              {guide.fun.map((item, i) => (
                <GuideCard
                  key={item.name}
                  item={item}
                  imageSrc={FUN_IMAGES[i] ?? undefined}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-pearl px-6 py-16 sm:px-10">
        <ScrollReveal>
          <div className="mx-auto max-w-lg">
            <h2 className="font-heading text-3xl text-charcoal italic">
              {guide.tipsTitle}
            </h2>
            <ul className="mt-6 space-y-4">
              {guide.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-4 font-body text-sm font-light leading-relaxed text-charcoal/55"
                >
                  <span className="mt-2 h-px w-4 shrink-0 bg-champagne" />
                  {tip}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="mt-10 inline-flex w-full items-center justify-center border border-champagne py-3.5 font-body text-[11px] font-light tracking-[0.2em] text-charcoal uppercase transition-all hover:bg-linen"
            >
              {guide.backHome}
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </main>
  );
}
