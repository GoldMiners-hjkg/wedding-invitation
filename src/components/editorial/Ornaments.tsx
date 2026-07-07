"use client";

import Image from "next/image";
import { MEDIA } from "@/lib/wedding";

const { ornaments } = MEDIA;

/** AI-generated crest — transparent PNG, shells + pearls */
export function CrestOrnament({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "hero";
  className?: string;
}) {
  const src =
    variant === "hero" ? ornaments.crestHero : ornaments.crestLight;

  return (
    <Image
      src={src}
      alt=""
      width={720}
      height={218}
      unoptimized
      priority={variant === "hero"}
      className={`h-auto w-56 bg-transparent object-contain sm:w-64 ${className}`}
      aria-hidden
    />
  );
}

/** Compact section divider — transparent PNG */
export function DividerOrnament({ className = "" }: { className?: string }) {
  return (
    <Image
      src={ornaments.divider}
      alt=""
      width={560}
      height={88}
      unoptimized
      className={`h-auto w-44 bg-transparent object-contain sm:w-52 ${className}`}
      aria-hidden
    />
  );
}

/** Ocean horizon wave band — transparent PNG */
export function WaveOrnament({ className = "" }: { className?: string }) {
  return (
    <Image
      src={ornaments.wave}
      alt=""
      width={560}
      height={50}
      unoptimized
      className={`h-auto w-52 bg-transparent object-contain sm:w-60 ${className}`}
      aria-hidden
    />
  );
}
