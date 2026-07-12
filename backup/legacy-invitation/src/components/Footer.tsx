"use client";

import { CoupleNames } from "./CoupleNames";
import { CrestOrnament } from "@/components/editorial/Ornaments";
import { useLanguage } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useLanguage();
  const { wedding, footer } = t;

  return (
    <footer className="relative px-6 py-20 text-center vintage-text-halo">
      <CrestOrnament className="mx-auto mb-8" />

      <CoupleNames size="medium" theme="light" />
      <p className="text-eyebrow mt-5">{wedding.dateShort}</p>

      <p className="text-eyebrow mt-8 opacity-80">{footer.withLove}</p>
    </footer>
  );
}
