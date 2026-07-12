/** Decorative ocean SVG motifs — shells, pearls, dolphins, waves */

"use client";

import { useId } from "react";

export function ScallopShell({
  className = "",
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M32 8c-14 0-24 12-24 26 0 8 6 14 14 16 2.5.5 5-.5 7-2 2 1.5 4.5 2.5 7 2 8-2 14-8 14-16 0-14-10-26-24-26z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M32 12c-11 0-19 10-19 22 0 6 4 11 10 13M32 12c11 0 19 10 19 22 0 6-4 11-10 13M32 12v35M22 28c3-4 7-6 10-6s7 2 10 6M18 36c4-3 9-5 14-5s10 2 14 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function Pearl({ className = "", size = 10 }: { className?: string; size?: number }) {
  const gradId = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className={className} aria-hidden>
      <circle cx="6" cy="6" r="5" fill={`url(#${gradId})`} />
      <circle cx="4.5" cy="4" r="1.5" fill="white" opacity="0.55" />
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#FAFCFD" />
          <stop offset="55%" stopColor="#C4D8E0" />
          <stop offset="100%" stopColor="#8AABB8" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function PearlString({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <Pearl key={i} size={i === 2 ? 12 : 8} className="opacity-90" />
      ))}
    </div>
  );
}

export function Dolphin({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 48"
      fill="none"
      className={`${flip ? "-scale-x-100" : ""} ${className}`}
      aria-hidden
    >
      <path
        d="M8 28c8-10 22-16 38-14 10 1 18 6 24 14 4 5 8 8 14 8 6 0 10-3 12-8-2 6-8 10-16 10-8 0-14-4-20-10-8-8-18-12-30-10-8 1-14 5-18 10 2-4 6-7 12-8-4-2-8-2-12 0 3-2 7-3 10-2z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M12 26c6-8 18-13 32-12 9 1 16 5 21 11 3 4 6 6 11 6 4 0 7-2 9-6M20 24c-2 2-3 5-2 8M52 16c-1-4 1-8 5-10M68 22c2 1 4 1 6 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <circle cx="78" cy="20" r="1.5" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

export function Starfish({
  className = "",
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M24 4l4 14 14-2-8 12 10 10-14-4-4 14-8-12-10 10-4-14-14 2 8-12z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.65"
      />
    </svg>
  );
}

export function Bubble({
  className = "",
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35" />
      <circle cx="6" cy="6" r="1.5" fill="white" opacity="0.4" />
    </svg>
  );
}
