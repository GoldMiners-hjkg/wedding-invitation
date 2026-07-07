"use client";

import { LanguageProvider } from "@/lib/i18n/context";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <LanguageSwitcher />
      {children}
    </LanguageProvider>
  );
}
