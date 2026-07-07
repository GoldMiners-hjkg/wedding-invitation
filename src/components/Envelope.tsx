"use client";

import Image from "next/image";

/** AI-generated envelope — single source, split for flap animation */
export const ENVELOPE_ASPECT = 1094 / 722;
export const ENVELOPE_FLAP_RATIO = 317 / 722;

interface EnvelopeProps {
  className?: string;
  open?: boolean;
}

export function Envelope({ className = "", open = false }: EnvelopeProps) {
  return (
    <div
      className={`envelope-scene relative w-full drop-shadow-[0_10px_28px_rgba(68,68,68,0.16)] ${className}`}
      style={{ aspectRatio: String(ENVELOPE_ASPECT) }}
      aria-hidden
    >
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: `${(1 - ENVELOPE_FLAP_RATIO) * 100 + 1.2}%` }}
      >
        <Image
          src="/images/envelope-ai-body.png"
          alt=""
          fill
          unoptimized
          draggable={false}
          className="object-contain object-bottom"
          sizes="280px"
        />
      </div>

      <div
        className={`pointer-events-none absolute z-[1] ${
          open ? "envelope-inner-reveal" : "opacity-0"
        }`}
        style={{
          left: "20%",
          right: "20%",
          top: `${ENVELOPE_FLAP_RATIO * 100 - 5.5}%`,
          height: "13%",
          background:
            "linear-gradient(180deg, #A89B8E 0%, #85786C 50%, #6E6359 100%)",
          clipPath: "polygon(6% 0%, 50% 38%, 94% 0%, 100% 100%, 0% 100%)",
          boxShadow: "inset 0 5px 14px rgba(0,0,0,0.38)",
        }}
      />

      <div
        className="envelope-flap-flip absolute inset-x-0 top-0 z-[2]"
        style={{ height: `${ENVELOPE_FLAP_RATIO * 100}%` }}
      >
        <div
          className={`relative h-full w-full ${open ? "envelope-flap-open" : ""}`}
          style={{ transformOrigin: "50% 100%" }}
        >
          <Image
            src="/images/envelope-ai-flap.png"
            alt=""
            fill
            unoptimized
            draggable={false}
            className="object-contain object-top"
            sizes="280px"
          />
        </div>
      </div>
    </div>
  );
}
