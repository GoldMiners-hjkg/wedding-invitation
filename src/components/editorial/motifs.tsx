"use client";

import { DividerOrnament } from "./Ornaments";

/** Three cathedral arches — kept for optional use */
export function CathedralArch({
  className = "",
  variant = "triple",
}: {
  className?: string;
  variant?: "triple" | "single";
}) {
  if (variant === "single") {
    return (
      <svg
        viewBox="0 0 80 48"
        fill="none"
        className={className}
        aria-hidden
      >
        <path
          d="M8 44V28C8 16 18 8 40 8s32 8 32 20v16"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.55"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 200 56"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M12 50V34C12 22 24 14 40 14s28 8 28 20v16M72 50V30C72 18 84 10 100 10s28 8 28 20v20M132 50V34C132 22 144 14 160 14s28 8 28 20v16"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function HorizonLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`} aria-hidden>
      <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-wine/25 to-transparent" />
      <div className="h-px w-full max-w-[280px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </div>
  );
}

export function EditorialSectionHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <DividerOrnament />
      {children}
    </div>
  );
}

export function SectionDivider({
  from = "sky",
  to = "cream",
}: {
  from?: "sky" | "sky-light" | "cream" | "pearl" | "linen" | "ivory-soft" | "powder";
  to?: "sky" | "sky-light" | "cream" | "pearl" | "linen" | "ivory-soft" | "powder";
}) {
  const bgMap = {
    sky: "bg-sky",
    "sky-light": "bg-sky-light",
    cream: "bg-cream/80",
    pearl: "bg-pearl",
    linen: "bg-linen",
    "ivory-soft": "bg-ivory-soft",
    powder: "bg-powder/30",
  };

  return (
    <div
      className={`relative flex h-16 w-full items-center justify-center ${bgMap[from]}`}
      aria-hidden
    >
      <div
        className={`absolute inset-x-0 bottom-0 h-6 ${bgMap[to]}`}
        style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
      />
    </div>
  );
}
