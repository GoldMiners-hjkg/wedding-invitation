"use client";

/** White lace corner accents — decorative only, not background */
export function LaceAccents({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <LaceCorner className="absolute -left-1 -top-1 h-24 w-24 opacity-[0.42] sm:h-28 sm:w-28" />
      <LaceCorner className="absolute -right-1 -top-1 h-24 w-24 -scale-x-100 opacity-[0.42] sm:h-28 sm:w-28" />
      <LaceCorner className="absolute -bottom-1 -left-1 h-20 w-20 rotate-180 opacity-[0.32] sm:h-24 sm:w-24" />
      <LaceCorner className="absolute -bottom-1 -right-1 h-20 w-20 -scale-x-100 rotate-180 opacity-[0.32] sm:h-24 sm:w-24" />

      <LaceBand className="absolute left-1/2 top-[4%] w-[min(72%,280px)] -translate-x-1/2 opacity-[0.38]" />
      <LaceBand className="absolute bottom-[5%] left-1/2 w-[min(60%,240px)] -translate-x-1/2 rotate-180 opacity-[0.28]" />
    </div>
  );
}

function LaceCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className}>
      <path
        fill="rgba(255,252,248,0.92)"
        d="M0 0 H28 C18 8 10 18 8 32 C6 48 14 62 28 72 C20 58 18 42 24 28 C30 14 42 4 58 0 H0 Z"
      />
      <path
        fill="rgba(255,252,248,0.75)"
        d="M0 0 C12 6 20 16 22 28 C24 40 18 52 8 62 C16 48 18 34 14 22 C10 10 0 2 0 0 Z"
      />
      <path
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.6"
        fill="none"
        d="M6 6 Q18 14 22 26 Q26 38 18 50 M10 10 Q20 18 24 30"
      />
      <circle cx="20" cy="18" r="2.2" fill="rgba(255,255,255,0.65)" />
      <circle cx="14" cy="32" r="1.6" fill="rgba(255,255,255,0.5)" />
      <circle cx="28" cy="28" r="1.4" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}

function LaceBand({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 18" preserveAspectRatio="none" className={`h-[18px] ${className}`}>
      <path
        fill="rgba(255,252,248,0.88)"
        d="M0 18 V10 Q14 0 28 10 Q42 18 56 10 Q70 0 84 10 Q98 18 112 10 Q126 0 140 10
           Q154 18 168 10 Q182 0 196 10 Q210 18 224 10 Q238 0 252 10 Q266 18 280 10 V18 Z"
      />
      <path
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="0.5"
        d="M0 13 Q28 5 56 13 Q84 21 112 13 Q140 5 168 13 Q196 21 224 13 Q252 5 280 13"
      />
    </svg>
  );
}
