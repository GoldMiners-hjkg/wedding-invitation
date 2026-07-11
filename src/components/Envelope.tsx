"use client";

/**
 * Lightweight paper envelope built from CSS layers.
 * Keeping this asset-free avoids the mismatched geometry and heavy realism of
 * the previous split PNG while preserving the 3D flap animation.
 */
export const ENVELOPE_ASPECT = 1.56;
export const ENVELOPE_FLAP_RATIO = 0.42;

interface EnvelopeProps {
  className?: string;
  open?: boolean;
}

export function Envelope({ className = "", open = false }: EnvelopeProps) {
  return (
    <div
      className={`paper-envelope relative w-full ${open ? "paper-envelope--open" : ""} ${className}`}
      style={{ aspectRatio: String(ENVELOPE_ASPECT) }}
      aria-hidden
    >
      <div className="paper-envelope__back" />

      <div className="paper-envelope__flap">
        <div className="paper-envelope__flap-face paper-envelope__flap-face--front" />
        <div className="paper-envelope__flap-face paper-envelope__flap-face--back" />
      </div>

      <div className="paper-envelope__front">
        <span className="paper-envelope__monogram">Z · S</span>
        <span className="paper-envelope__date">2027.01.24</span>
      </div>

      <span className="paper-envelope__seal">囍</span>
    </div>
  );
}
