"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Envelope,
  ENVELOPE_ASPECT,
} from "@/components/Envelope";

const SCATTER = [
  { x: 4, y: 6, rotate: -11, scale: 0.92, z: 2 },
  { x: 52, y: 0, rotate: 7, scale: 1, z: 4 },
  { x: 26, y: 24, rotate: -4, scale: 0.88, z: 3 },
  { x: 66, y: 28, rotate: 13, scale: 0.86, z: 5 },
  { x: 8, y: 50, rotate: 5, scale: 0.94, z: 6 },
  { x: 42, y: 54, rotate: -9, scale: 0.9, z: 7 },
] as const;

/** Envelope near the continue button (lower on the table) */
const ENVELOPE = { left: 50, top: 52, width: 68 } as const;

function getEnvelopeMouth() {
  const heightPct = ENVELOPE.width * (1 / ENVELOPE_ASPECT);
  return {
    x: ENVELOPE.left,
    // Mouth of open coastal-pearl photo — just below the open flap / pocket V
    y: ENVELOPE.top + heightPct * 0.55,
  };
}

const ENVELOPE_OPEN_DELAY_MS = 1200;
const ENVELOPE_OPEN_MS = 850;
const PHOTO_START_DELAY_MS = ENVELOPE_OPEN_DELAY_MS + ENVELOPE_OPEN_MS + 280;
const DRAW_DURATION_MS = 1850;
const DRAW_STAGGER_MS = 260;
const ENVELOPE_VANISH_MS = 980;
const DRAW_EASING = "cubic-bezier(0.33, 0.72, 0.2, 1)";

const SCROLL_LOCK_PX = 10;
const TAP_MAX_MOVE_PX = 12;

interface DrawPath {
  startX: number;
  startY: number;
  holdX: number;
  holdY: number;
  riseX: number;
  riseY: number;
  midX: number;
  midY: number;
}

interface ScatteredPhotoTableProps {
  photos: readonly string[];
  onOpen: (index: number) => void;
  onBurstComplete?: () => void;
  className?: string;
}

type GestureState = {
  x: number;
  y: number;
  index: number;
  scrolling: boolean;
};

function computeDrawPath(
  width: number,
  height: number,
  layout: (typeof SCATTER)[number],
): DrawPath {
  const mouth = getEnvelopeMouth();
  const mouthX = (mouth.x / 100) * width;
  const mouthY = (mouth.y / 100) * height;
  const endX = (layout.x / 100) * width;
  const endY = (layout.y / 100) * height;
  const cardW = layout.scale * 0.42 * width;
  const cardH = cardW * (4 / 3);

  // Start tucked inside the pocket (below the mouth opening)
  const startX = mouthX - cardW * 0.5;
  const startY = mouthY - cardH * 0.12;

  // Half-drawn: mostly still in the envelope, top peeking through the V
  const holdX = mouthX - cardW * 0.5;
  const holdY = mouthY - cardH * 0.48;

  // Rise clear of the mouth before arcing out
  const riseX = mouthX - cardW * 0.5;
  const riseY = mouthY - cardH * 1.05;

  // Soft arc toward final scatter slot
  const midX = startX + (endX - startX) * 0.55;
  const midY = riseY + (endY - riseY) * 0.35 - 12;

  return { startX, startY, holdX, holdY, riseX, riseY, midX, midY };
}

export function ScatteredPhotoTable({
  photos,
  onOpen,
  onBurstComplete,
  className,
}: ScatteredPhotoTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animatedRef = useRef(new Set<number>());
  const pressingRef = useRef(false);
  const gestureRef = useRef<GestureState | null>(null);
  const tableSizeRef = useRef({ width: 0, height: 0 });
  const [tableReady, setTableReady] = useState(false);
  const [liftedIndex, setLiftedIndex] = useState<number | null>(null);
  const [envelopeEnter, setEnvelopeEnter] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [envelopeVanish, setEnvelopeVanish] = useState(false);
  const [envelopeHidden, setEnvelopeHidden] = useState(false);
  const [burstComplete, setBurstComplete] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const lift = useCallback(
    (index: number | null) => {
      if (!burstComplete) return;
      setLiftedIndex(index);
    },
    [burstComplete],
  );

  const runDrawOut = useCallback(
    (index: number) => {
      if (animatedRef.current.has(index) || reduceMotion) return;

      const card = cardRefs.current[index];
      const wrapper = card?.parentElement as HTMLElement | null;
      const { width, height } = tableSizeRef.current;
      if (!card || !wrapper || width <= 0) return;

      animatedRef.current.add(index);
      const layout = SCATTER[index % SCATTER.length];
      const path = computeDrawPath(width, height, layout);

      const endLeft = (layout.x / 100) * width;
      const endTop = (layout.y / 100) * height;

      // Animate from absolute mouth coords via translate relative to final slot
      const dx0 = path.startX - endLeft;
      const dy0 = path.startY - endTop;
      const dxHold = path.holdX - endLeft;
      const dyHold = path.holdY - endTop;
      const dxRise = path.riseX - endLeft;
      const dyRise = path.riseY - endTop;
      const dxMid = path.midX - endLeft;
      const dyMid = path.midY - endTop;

      card.style.visibility = "visible";
      card.style.opacity = "0";
      // Stay behind the pocket while emerging through the V opening
      wrapper.style.zIndex = String(6 + index);

      const animation = card.animate(
        [
          {
            // Tucked inside
            transform: `translate3d(${dx0}px, ${dy0}px, 0) rotate(0deg) scale(0.34)`,
            opacity: 0,
            offset: 0,
          },
          {
            // Draw out halfway — peeking from the V
            transform: `translate3d(${dxHold}px, ${dyHold}px, 0) rotate(${layout.rotate * 0.08}deg) scale(0.52)`,
            opacity: 1,
            offset: 0.22,
          },
          {
            // Hold on the envelope before popping free
            transform: `translate3d(${dxHold}px, ${dyHold}px, 0) rotate(${layout.rotate * 0.1}deg) scale(0.54)`,
            opacity: 1,
            offset: 0.42,
          },
          {
            // Pop clear of the mouth
            transform: `translate3d(${dxRise}px, ${dyRise}px, 0) rotate(${layout.rotate * 0.22}deg) scale(0.78)`,
            opacity: 1,
            offset: 0.58,
          },
          {
            // Soft arc into place
            transform: `translate3d(${dxMid}px, ${dyMid}px, 0) rotate(${layout.rotate * 0.72}deg) scale(0.96)`,
            opacity: 1,
            offset: 0.8,
          },
          {
            transform: `translate3d(0px, 0px, 0) rotate(${layout.rotate}deg) scale(1)`,
            opacity: 1,
            offset: 1,
          },
        ],
        {
          duration: DRAW_DURATION_MS,
          easing: DRAW_EASING,
          fill: "forwards",
        },
      );

      // Once past the hold, lift above the front pocket for the pop-out
      window.setTimeout(() => {
        if (wrapper.isConnected) wrapper.style.zIndex = String(16 + index);
      }, DRAW_DURATION_MS * 0.48);

      animation.onfinish = () => {
        card.style.transform = `rotate(${layout.rotate}deg) scale(1)`;
        card.style.opacity = "1";
        wrapper.style.zIndex = String(layout.z);
      };
    },
    [reduceMotion],
  );

  useEffect(() => {
    if (!burstComplete) return;
    onBurstComplete?.();
  }, [burstComplete, onBurstComplete]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    const update = () => {
      const { width, height } = table.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      tableSizeRef.current = { width, height };
      setTableReady(true);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(table);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      const frame = window.requestAnimationFrame(() => {
        setRevealedCount(photos.length);
        setBurstComplete(true);
        setEnvelopeHidden(true);
        photos.forEach((_, i) => {
          const card = cardRefs.current[i];
          if (!card) return;
          const layout = SCATTER[i % SCATTER.length];
          card.style.visibility = "visible";
          card.style.opacity = "1";
          card.style.transform = `rotate(${layout.rotate}deg) scale(1)`;
        });
      });
      return () => window.cancelAnimationFrame(frame);
    }
    if (!tableReady) return;

    const lastPhotoStart =
      PHOTO_START_DELAY_MS + (photos.length - 1) * DRAW_STAGGER_MS;
    const lastPhotoEnd = lastPhotoStart + DRAW_DURATION_MS;
    // Fade as soon as the last photo has cleared the mouth
    const envelopeVanishAt = lastPhotoStart + DRAW_DURATION_MS * 0.58;

    const timers = [
      window.setTimeout(() => setEnvelopeEnter(true), 60),
      window.setTimeout(() => setEnvelopeOpen(true), ENVELOPE_OPEN_DELAY_MS),
      ...photos.map((_, i) =>
        window.setTimeout(
          () => setRevealedCount((count) => Math.max(count, i + 1)),
          PHOTO_START_DELAY_MS + i * DRAW_STAGGER_MS,
        ),
      ),
      window.setTimeout(() => setEnvelopeVanish(true), envelopeVanishAt),
      window.setTimeout(
        () => setEnvelopeHidden(true),
        envelopeVanishAt + ENVELOPE_VANISH_MS,
      ),
      window.setTimeout(() => setBurstComplete(true), lastPhotoEnd + 60),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [tableReady, photos.length, reduceMotion, photos]);

  useEffect(() => {
    if (revealedCount <= 0 || reduceMotion) return;
    runDrawOut(revealedCount - 1);
  }, [revealedCount, reduceMotion, runDrawOut]);

  const indexFromPoint = useCallback((clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY);
    const card = el?.closest("[data-photo-index]");
    if (!card) return null;
    const idx = Number(card.getAttribute("data-photo-index"));
    return Number.isNaN(idx) ? null : idx;
  }, []);

  useEffect(() => {
    const onPointerUp = (e: PointerEvent) => {
      if (!pressingRef.current || !burstComplete) return;

      const gesture = gestureRef.current;
      pressingRef.current = false;
      gestureRef.current = null;

      if (!gesture || gesture.scrolling) {
        lift(null);
        return;
      }

      const moved = Math.hypot(e.clientX - gesture.x, e.clientY - gesture.y);
      lift(null);

      if (moved <= TAP_MAX_MOVE_PX) {
        onOpen(gesture.index);
      }
    };

    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [burstComplete, lift, onOpen]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!burstComplete) return;

      const gesture = gestureRef.current;
      if (!pressingRef.current || !gesture || gesture.scrolling) return;

      const dx = e.clientX - gesture.x;
      const dy = e.clientY - gesture.y;

      if (Math.abs(dy) > SCROLL_LOCK_PX && Math.abs(dy) > Math.abs(dx)) {
        gesture.scrolling = true;
        pressingRef.current = false;
        lift(null);
        return;
      }

      if (Math.hypot(dx, dy) > TAP_MAX_MOVE_PX) return;

      const idx = indexFromPoint(e.clientX, e.clientY);
      if (idx !== null) lift(idx);
    },
    [burstComplete, indexFromPoint, lift],
  );

  return (
    <div
      ref={tableRef}
      className={
        className ??
        "relative mx-auto mt-4 h-[min(58vh,440px)] w-[min(92vw,400px)] touch-pan-y [contain:layout_paint]"
      }
      onPointerMove={handlePointerMove}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-sm border border-sky-light/90 shadow-[0_12px_40px_rgba(107,48,69,0.08)]"
        style={{
          background:
            "linear-gradient(160deg, rgba(250,248,245,0.95) 0%, rgba(228,238,245,0.9) 45%, rgba(250,248,245,0.95) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-2 border border-champagne/25"
        aria-hidden
      />

      {!envelopeHidden && !reduceMotion && (
        <>
          {/* Closed + open back photo — behind drawing photos */}
          <div
            className={`pointer-events-none absolute inset-x-0 z-[5] mx-auto w-[68%] max-w-[280px] ${
              envelopeEnter ? "envelope-pop-in" : "opacity-0"
            } ${envelopeVanish ? "envelope-vanish" : ""}`}
            style={{ top: `${ENVELOPE.top}%` }}
          >
            <Envelope
              open={envelopeOpen}
              layer="back"
              className="h-auto w-full"
            />
          </div>

          {/* Pocket flaps from open photo — above photos so they draw through the V */}
          <div
            className={`pointer-events-none absolute inset-x-0 z-[14] mx-auto w-[68%] max-w-[280px] ${
              envelopeEnter ? "envelope-pop-in" : "opacity-0"
            } ${envelopeVanish ? "envelope-vanish" : ""}`}
            style={{ top: `${ENVELOPE.top}%` }}
          >
            <Envelope
              open={envelopeOpen}
              layer="pocket"
              className="h-auto w-full"
            />
          </div>
        </>
      )}

      {photos.map((src, i) => {
        const layout = SCATTER[i % SCATTER.length];
        const isLifted = liftedIndex === i;
        const isVisible = burstComplete || i < revealedCount;
        // Between back (5) and front (14) while drawing out; above after clearing
        const drawingZ = 6 + i;

        return (
          <div
            key={src}
            data-photo-index={i}
            className={`absolute select-none ${burstComplete ? "touch-pan-y" : "pointer-events-none"}`}
            style={{
              left: `${layout.x}%`,
              top: `${layout.y}%`,
              width: `${layout.scale * 42}%`,
              zIndex: burstComplete
                ? layout.z + (isLifted ? 20 : 0)
                : isVisible
                  ? drawingZ
                  : 0,
            }}
            onPointerEnter={() => {
              if (!pressingRef.current) lift(i);
            }}
            onPointerLeave={() => {
              if (!pressingRef.current) lift(null);
            }}
            onPointerDown={(e) => {
              if (!burstComplete) return;
              if (e.pointerType === "mouse" && e.button !== 0) return;

              pressingRef.current = true;
              gestureRef.current = {
                x: e.clientX,
                y: e.clientY,
                index: i,
                scrolling: false,
              };
              lift(i);
            }}
          >
            <div
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`origin-[center_88%] bg-pearl p-1 pb-5 shadow-[0_6px_20px_rgba(68,68,68,0.12)] [backface-visibility:hidden] [transform:translateZ(0)] ${
                burstComplete
                  ? "transition-[transform,box-shadow] duration-200 ease-out"
                  : ""
              }`}
              style={{
                visibility: isVisible ? "visible" : "hidden",
                opacity: burstComplete ? 1 : 0,
                transform: burstComplete
                  ? `rotate(${layout.rotate}deg) scale(${isLifted ? 1.12 : 1})`
                  : undefined,
                boxShadow: isLifted
                  ? "0 16px 36px rgba(68,68,68,0.18), 0 0 1px rgba(217,212,204,0.5)"
                  : undefined,
              }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-linen/50">
                <Image
                  src={src}
                  alt=""
                  fill
                  unoptimized
                  priority
                  draggable={false}
                  className="pointer-events-none object-cover"
                  sizes="160px"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
