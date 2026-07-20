"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/lib/i18n/context";
import { LanguageSwitcher } from "./LanguageSwitcher";

function DisablePageZoom({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const blockGesture = (e: Event) => {
      e.preventDefault();
    };

    /** iOS Safari pinch / double-tap zoom gesture events */
    document.addEventListener("gesturestart", blockGesture, { passive: false });
    document.addEventListener("gesturechange", blockGesture, {
      passive: false,
    });
    document.addEventListener("gestureend", blockGesture, { passive: false });

    const blockMultiTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener("touchmove", blockMultiTouch, { passive: false });

    return () => {
      document.removeEventListener("gesturestart", blockGesture);
      document.removeEventListener("gesturechange", blockGesture);
      document.removeEventListener("gestureend", blockGesture);
      document.removeEventListener("touchmove", blockMultiTouch);
    };
  }, []);

  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <DisablePageZoom>
        <LanguageSwitcher />
        {children}
      </DisablePageZoom>
    </LanguageProvider>
  );
}
