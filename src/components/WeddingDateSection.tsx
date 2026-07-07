"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { DividerOrnament } from "@/components/editorial/Ornaments";
import { MEDIA, WEDDING } from "@/lib/wedding";

/** couple-forest.jpg — 5472×3648, landscape */
const PHOTO_ASPECT = 5472 / 3648;

/**
 * Keep the calendar inside the top-left sky area so it does not cover
 * the alpacas (lower-left) or the couple (right).
 */
const CALENDAR_MAX_WIDTH = 0.46; // 40% × 1.15
const CALENDAR_MAX_HEIGHT = 0.39; // 34% × 1.15

const WEEKDAYS: Record<Locale, string[]> = {
  en: ["S", "M", "T", "W", "T", "F", "S"],
  "zh-CN": ["日", "一", "二", "三", "四", "五", "六"],
  "zh-TW": ["日", "一", "二", "三", "四", "五", "六"],
};

function formatMonthTitle(locale: Locale, year: number, month: number) {
  const date = new Date(year, month - 1, 1);
  if (locale === "en") {
    return new Intl.DateTimeFormat("en", {
      month: "long",
      year: "numeric",
    }).format(date);
  }
  return new Intl.DateTimeFormat(locale === "zh-TW" ? "zh-TW" : "zh-CN", {
    year: "numeric",
    month: "long",
  }).format(date);
}

function buildMonthGrid(year: number, month: number) {
  const leading = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }
  return cells;
}

function getContainedImageRect(
  width: number,
  height: number,
  aspectRatio: number,
) {
  const containerAspect = width / height;

  if (containerAspect > aspectRatio) {
    const imageHeight = height;
    const imageWidth = height * aspectRatio;
    return {
      top: 0,
      left: (width - imageWidth) / 2,
      width: imageWidth,
      height: imageHeight,
    };
  }

  const imageWidth = width;
  const imageHeight = width / aspectRatio;
  return {
    top: (height - imageHeight) / 2,
    left: 0,
    width: imageWidth,
    height: imageHeight,
  };
}

function FrostedCalendar({
  locale,
  year,
  month,
  weddingDay,
}: {
  locale: Locale;
  year: number;
  month: number;
  weddingDay: number;
}) {
  const monthTitle = formatMonthTitle(locale, year, month);
  const weekdays = WEEKDAYS[locale];
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  return (
    <div className="flex h-full w-full flex-col rounded-md border border-wine/15 bg-cream/75 p-[0.5em] text-[length:clamp(6px,7.5cqmin,15px)] shadow-[0_10px_36px_rgba(107,48,69,0.1)] backdrop-blur-xl">
      <p className="shrink-0 font-heading text-[1.15em] leading-tight text-wine">
        {monthTitle}
      </p>

      <div className="mt-[0.35em] shrink-0 grid grid-cols-7 gap-x-[0.1em] text-center">
        {weekdays.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="font-body text-[0.58em] font-medium leading-none text-wine-deep"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="mt-[0.12em] grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-[0.06em] text-center">
        {cells.map((cell, index) => {
          if (cell === null) {
            return <span key={`empty-${index}`} aria-hidden />;
          }

          const isWeddingDay = cell === weddingDay;

          return (
            <span
              key={cell}
              className={`flex h-full w-full items-center justify-center font-body text-[0.62em] leading-none ${
                isWeddingDay
                  ? "rounded-full bg-blush font-semibold text-wine ring-1 ring-wine/20"
                  : "text-wine-deep"
              }`}
            >
              {cell}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function WeddingDateSection() {
  const { locale } = useLanguage();
  const { year, month, day } = WEDDING;
  const frameRef = useRef<HTMLDivElement>(null);
  const [imageRect, setImageRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const { width, height } = frame.getBoundingClientRect();
      setImageRect(getContainedImageRect(width, height, PHOTO_ASPECT));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const calendarWidth =
    imageRect.width > 0 ? imageRect.width * CALENDAR_MAX_WIDTH : 0;
  const calendarHeight =
    imageRect.height > 0 ? imageRect.height * CALENDAR_MAX_HEIGHT : 0;

  return (
    <section className="bg-transparent">
      <div className="flex justify-center px-6 pt-8 pb-4 sm:pt-10 sm:pb-5">
        <DividerOrnament />
      </div>

      <div className="px-[5%] pb-8 sm:px-[6%] sm:pb-10">
        <div
          ref={frameRef}
          className="relative mx-auto w-full max-h-[72dvh]"
          style={{ aspectRatio: PHOTO_ASPECT }}
        >
        <Image
          src={MEDIA.couple}
          alt=""
          fill
          priority
          className="object-contain object-center"
          sizes="100vw"
        />

        {imageRect.width > 0 && (
          <div
            className="pointer-events-none absolute z-10"
            style={{
              top: imageRect.top,
              left: imageRect.left,
              width: imageRect.width,
              height: imageRect.height,
            }}
          >
            <div
              className="absolute top-[2.5%] left-[2.5%] [container-type:size]"
              style={{
                width: calendarWidth,
                height: calendarHeight,
              }}
            >
              <FrostedCalendar
                locale={locale}
                year={year}
                month={month}
                weddingDay={day}
              />
            </div>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
