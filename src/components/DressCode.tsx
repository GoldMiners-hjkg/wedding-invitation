"use client";

import { ScrollReveal } from "./ScrollReveal";
import { EditorialSectionHeader } from "@/components/editorial/motifs";
import { DRESS_CODE_COLORS } from "@/lib/wedding";
import { useLanguage } from "@/lib/i18n/context";

export function DressCode() {
  const { t } = useLanguage();
  const { dressCode } = t;

  return (
    <section className="relative px-6 py-20 sm:px-10">
      <ScrollReveal>
        <div className="mx-auto max-w-lg vintage-text-halo">
          <EditorialSectionHeader>
            <p className="text-eyebrow">{dressCode.eyebrow}</p>
            <h2 className="text-vintage-title mt-3 text-center text-4xl sm:text-5xl">
              {dressCode.title}
            </h2>
          </EditorialSectionHeader>

          <div className="mt-12 flex justify-center gap-4">
            {DRESS_CODE_COLORS.map((color, i) => (
              <div
                key={color.hex}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="h-11 w-11 border border-wine/20 sm:h-12 sm:w-12"
                  style={{ backgroundColor: color.hex }}
                  title={dressCode.colors[i]}
                />
                <span className="hidden font-body text-[10px] font-medium tracking-wide text-wine-deep sm:block">
                  {dressCode.colors[i]}
                </span>
              </div>
            ))}
          </div>

          <ul className="mt-12 space-y-5">
            {dressCode.guidance.map((item) => (
              <li
                key={item}
                className="text-body-vintage flex items-start gap-4"
              >
                <span className="mt-2.5 h-px w-4 shrink-0 bg-wine/40" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>
    </section>
  );
}
