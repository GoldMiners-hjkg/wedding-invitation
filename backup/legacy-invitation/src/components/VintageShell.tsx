"use client";

import { CoastalDecor } from "@/components/CoastalDecor";
import { LaceAccents } from "@/components/LaceAccents";

/** Textured dusty-blue column — white lace as accent only */
export function VintageShell({
  children,
  decor = true,
  className = "",
}: {
  children: React.ReactNode;
  decor?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`vintage-bg vintage-shell relative mx-auto min-h-dvh ${className}`}
    >
      {decor && <LaceAccents />}
      {decor && <CoastalDecor />}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
