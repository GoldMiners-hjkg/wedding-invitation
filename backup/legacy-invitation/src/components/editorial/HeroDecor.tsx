"use client";

import {
  CrestOrnament,
  DividerOrnament,
  WaveOrnament,
} from "./Ornaments";

export function HeroInvitationCrest({ className = "" }: { className?: string }) {
  return (
    <CrestOrnament
      variant="hero"
      className={`drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)] ${className}`}
    />
  );
}

export function HeroWaveBand({ className = "" }: { className?: string }) {
  return (
    <WaveOrnament
      className={`drop-shadow-[0_1px_8px_rgba(0,0,0,0.25)] ${className}`}
    />
  );
}

export { CrestOrnament, DividerOrnament, WaveOrnament } from "./Ornaments";
