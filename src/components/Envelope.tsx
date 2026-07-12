"use client";

import Image from "next/image";

/** Photo assets from option-1-coastal-pearl (closed left / open right). */
export const ENVELOPE_ASPECT = 752 / 883; // open state (taller with flap up)
export const ENVELOPE_FLAP_RATIO = 0.42; // mouth sits below open flap

const CLOSED_SRC = "/images/envelope/coastal-pearl-closed.png";
const OPEN_SRC = "/images/envelope/coastal-pearl-open.png";

interface EnvelopeProps {
  className?: string;
  open?: boolean;
  /** Split layers so photos can draw out between back and pocket */
  layer?: "full" | "back" | "pocket";
}

export function Envelope({
  className = "",
  open = false,
  layer = "full",
}: EnvelopeProps) {
  return (
    <div
      className={`coastal-envelope relative w-full ${open ? "coastal-envelope--open" : ""} ${className}`}
      style={{ aspectRatio: String(ENVELOPE_ASPECT) }}
      aria-hidden
    >
      {/* Closed state — fades out when open */}
      {(layer === "full" || layer === "back") && (
        <div
          className={`coastal-envelope__closed ${open ? "coastal-envelope__closed--hide" : ""}`}
        >
          <Image
            src={CLOSED_SRC}
            alt=""
            fill
            unoptimized
            priority
            draggable={false}
            className="object-contain object-bottom"
            sizes="300px"
          />
        </div>
      )}

      {/* Open back (full open photo) — behind drawing photos */}
      {(layer === "full" || layer === "back") && (
        <div
          className={`coastal-envelope__open ${open ? "coastal-envelope__open--show" : ""}`}
        >
          <Image
            src={OPEN_SRC}
            alt=""
            fill
            unoptimized
            priority
            draggable={false}
            className="object-contain object-bottom"
            sizes="300px"
          />
        </div>
      )}

      {/* Open pocket overlay — clips to front flaps so photos emerge through the V */}
      {(layer === "full" || layer === "pocket") && (
        <div
          className={`coastal-envelope__pocket ${open ? "coastal-envelope__pocket--show" : ""}`}
        >
          <Image
            src={OPEN_SRC}
            alt=""
            fill
            unoptimized
            priority
            draggable={false}
            className="object-contain object-bottom"
            sizes="300px"
          />
        </div>
      )}
    </div>
  );
}
