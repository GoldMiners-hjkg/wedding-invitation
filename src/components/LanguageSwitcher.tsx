"use client";

import { usePathname } from "next/navigation";
import { LOCALES } from "@/lib/i18n/types";
import { useLanguage } from "@/lib/i18n/context";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const { locale, setLocale } = useLanguage();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="pointer-events-auto fixed top-3 right-3 z-[9999] flex rounded-full border border-wine/20 bg-cream/85 p-0.5 shadow-[0_2px_12px_rgba(107,48,69,0.1)] backdrop-blur-md">
      {LOCALES.map((loc) => (
        <button
          key={loc.id}
          type="button"
          onClick={() => setLocale(loc.id)}
          className={`min-h-7 min-w-7 rounded-full px-1.5 py-0.5 font-body text-[10px] font-medium tracking-wide transition-all ${
            locale === loc.id
              ? "bg-sky-light text-wine-deep"
              : "text-wine-deep/75 hover:text-wine"
          }`}
          aria-label={loc.id}
          aria-pressed={locale === loc.id}
        >
          {loc.label}
        </button>
      ))}
    </div>
  );
}
