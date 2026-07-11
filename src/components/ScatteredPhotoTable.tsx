"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Envelope, ENVELOPE_ASPECT, ENVELOPE_FLAP_RATIO } from "@/components/Envelope";

const SCATTER = [
  { x: 4, y: 6, rotate: -11, scale: 0.92, z: 2 },
  { x: 52, y: 0, rotate: 7, scale: 1, z: 4 },
  { x: 26, y: 24, rotate: -4, scale: 0.88, z: 3 },
  { x: 66, y: 28, rotate: 13, scale: 0.86, z: 5 },
  { x: 8, y: 50, rotate: 5, scale: 0.94, z: 6 },
  { x: 42, y: 54, rotate: -9, scale: 0.9, z: 7 },
] as const;

const ENVELOPE = { left: 50, top: 43, width: 64 } as const;

function getEnvelopeMouth() {
  const heightPct = ENVELOPE.width * (1 / ENVELOPE_ASPECT);
  return {
    x: ENVELOPE.left,
    y: ENVELOPE.top + heightPct * ENVELOPE_FLAP_RATIO,
  };
}

const ENVELOPE_OPEN_DELAY_MS = 650;
const ENVELOPE_FLAP_MS = 760;
const PHOTO_START_DELAY_MS = ENVELOPE_OPEN_DELAY_MS + ENVELOPE_FLAP_MS + 60;
const BURST_DURATION_MS = 860;
const BURST_STAGGER_MS = 110;
const ENVELOPE_VANISH_MS = 560;
const BURST_EASING = "cubic-bezier(0.22, 0.76, 0.24, 1)";

const SCROLL_LOCK_PX = 10;
const TAP_MAX_MOVE_PX = 12;

interface BurstOffset {
  dx: number;
  dy: number;
}

interface ScatteredPhotoTableProps {
  photos: readonly string[];
  onOpen: (index: number) => void;
  className?: string;
}

type GestureState = {
  x: number;
  y: number;
  index: number;
  scrolling: boolean;
};

function computeBurstOffset(
  width: number,
  height: number,
  layout: (typeof SCATTER)[number],
): BurstOffset {
  const mouth = getEnvelopeMouth();
  const mouthX = (mouth.x / 100) * width;
  const mouthY = (mouth.y / 100) * height;
  const endX = (layout.x / 100) * width;
  const endY = (layout.y / 100) * height;
  const cardW = layout.scale * 0.42 * width;

  return {
    dx: mouthX - endX - cardW * 0.5,
    dy: mouthY - endY - cardW * 0.55,
  };
}

export function ScatteredPhotoTable({
  photos,
  onOpen,
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

  const runBurst = useCallback(
    (index: number) => {
      if (animatedRef.current.has(index) || reduceMotion) return;

      const card = cardRefs.current[index];
      const { width, height } = tableSizeRef.current;
      if (!card || width <= 0) return;

      animatedRef.current.add(index);
      const layout = SCATTER[index % SCATTER.length];
      const { dx, dy } = computeBurstOffset(width, height, layout);

      card.style.visibility = "visible";
      card.style.opacity = "0";

      const animation = card.animate(
        [
          {
            transform: `translate3d(${dx}px, ${dy}px, 0) rotate(0deg) scale(0.34)`,
            opacity: 0,
            offset: 0,
          },
          {
            transform: `translate3d(${dx * 0.78}px, ${dy * 0.78 - 18}px, 0) rotate(${layout.rotate * 0.22}deg) scale(0.7)`,
            opacity: 1,
            offset: 0.36,
          },
          {
            transform: `translate3d(0px, -3px, 0) rotate(${layout.rotate}deg) scale(1.015)`,
            opacity: 1,
            offset: 0.84,
          },
          {
            transform: `translate3d(0px, 0px, 0) rotate(${layout.rotate}deg) scale(1)`,
            opacity: 1,
            offset: 1,
          },
        ],
        {
          duration: BURST_DURATION_MS,
          easing: BURST_EASING,
          fill: "forwards",
        },
      );

      animation.onfinish = () => {
        card.style.transform = `rotate(${layout.rotate}deg) scale(1)`;
        card.style.opacity = "1";
      };
    },
    [reduceMotion],
  );

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
      PHOTO_START_DELAY_MS + (photos.length - 1) * BURST_STAGGER_MS;
    const lastPhotoEnd = lastPhotoStart + BURST_DURATION_MS;

    const timers = [
      window.setTimeout(() => setEnvelopeEnter(true), 80),
      window.setTimeout(() => setEnvelopeOpen(true), ENVELOPE_OPEN_DELAY_MS),
      ...photos.map((_, i) =>
        window.setTimeout(
          () => setRevealedCount((count) => Math.max(count, i + 1)),
          PHOTO_START_DELAY_MS + i * BURST_STAGGER_MS,
        ),
      ),
      window.setTimeout(() => setEnvelopeVanish(true), lastPhotoEnd + 80),
      window.setTimeout(
        () => setEnvelopeHidden(true),
        lastPhotoEnd + 80 + ENVELOPE_VANISH_MS,
      ),
      window.setTimeout(() => setBurstComplete(true), lastPhotoEnd + 40),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [tableReady, photos.length, reduceMotion, photos]);

  useEffect(() => {
    if (revealedCount <= 0 || reduceMotion) return;
    runBurst(revealedCount - 1);
  }, [revealedCount, reduceMotion, runBurst]);

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
        <div
          className={`pointer-events-none absolute left-1/2 z-[8] w-[64%] max-w-[260px] ${
            envelopeEnter ? "envelope-pop-in" : "opacity-0"
          } ${envelopeVanish ? "envelope-vanish" : ""}`}
          style={{ top: `${ENVELOPE.top}%` }}
        >
          <Envelope open={envelopeOpen} className="h-auto w-full" />
        </div>
      )}

      {photos.map((src, i) => {
        const layout = SCATTER[i % SCATTER.length];
        const isLifted = liftedIndex === i;
        const isVisible = burstComplete || i < revealedCount;

        return (
          <div
            key={src}
            data-photo-index={i}
            className={`absolute select-none ${burstComplete ? "touch-pan-y" : "pointer-events-none"}`}
            style={{
              left: `${layout.x}%`,
              top: `${layout.y}%`,
              width: `${layout.scale * 42}%`,
              zIndex: isVisible && !burstComplete ? 10 + i : layout.z + (isLifted ? 20 : 0),
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
