"use client";

/** Cream inset card with ornamental lace-style scalloped border — reference invitation */
export function LaceFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto ${className}`}>
      <div className="relative bg-sky/40 p-[10px] shadow-[0_10px_40px_rgba(70,90,110,0.14)] sm:p-3">
        <LaceScallop className="absolute -top-[6px] left-2 right-2 text-white/90" />
        <LaceScallop className="absolute -bottom-[6px] left-2 right-2 rotate-180 text-white/90" />

        <div className="relative border border-white/25 bg-cream/95 px-5 py-7 sm:px-8 sm:py-9">
          <div
            className="pointer-events-none absolute inset-2 border border-wine/8"
            aria-hidden
          />
          {children}
        </div>
      </div>
    </div>
  );
}

function LaceScallop({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 14"
      preserveAspectRatio="none"
      className={`h-[14px] w-[calc(100%-16px)] ${className}`}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 14 V8
           Q10 0 20 8 Q30 14 40 8 Q50 0 60 8 Q70 14 80 8 Q90 0 100 8
           Q110 14 120 8 Q130 0 140 8 Q150 14 160 8 Q170 0 180 8
           Q190 14 200 8 Q210 0 220 8 Q230 14 240 8 Q250 0 260 8
           Q270 14 280 8 Q290 0 300 8 Q310 14 320 8 Q330 0 340 8
           Q350 14 360 8 Q370 0 380 8 Q390 14 400 8 V14 Z"
      />
      <path
        fill="none"
        stroke="#8B2847"
        strokeOpacity="0.12"
        strokeWidth="0.5"
        d="M0 10 Q20 4 40 10 Q60 16 80 10 Q100 4 120 10 Q140 16 160 10
           Q180 4 200 10 Q220 16 240 10 Q260 4 280 10 Q300 16 320 10
           Q340 4 360 10 Q380 16 400 10"
      />
    </svg>
  );
}
