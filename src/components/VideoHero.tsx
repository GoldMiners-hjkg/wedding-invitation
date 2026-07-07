"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { COUPLE, HERO_HEADLINES } from "@/lib/couple";
import { useLanguage } from "@/lib/i18n/context";
import { MEDIA, WEDDING } from "@/lib/wedding";

const textGlow =
  "[text-shadow:0_2px_16px_rgba(0,0,0,0.75),0_0_40px_rgba(0,0,0,0.45)]";

interface VideoHeroProps {
  onEnter: () => void;
  heroImage: string;
}

function HeroNameBlock({
  nameZh,
  nameEn,
  label,
  align,
}: {
  nameZh: string;
  nameEn: string;
  label: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex flex-col ${align === "left" ? "items-start text-left" : "items-end text-right"}`}
    >
      <span
        className={`font-heading text-2xl font-normal text-white sm:text-3xl ${textGlow}`}
      >
        {nameZh}
      </span>
      <span
        className={`mt-1 font-body text-[10px] font-medium tracking-[0.35em] text-white/75 uppercase ${textGlow}`}
      >
        {label}
      </span>
      <span
        className={`mt-1 font-body text-[11px] font-light tracking-[0.12em] text-white/85 ${textGlow}`}
      >
        {nameEn}
      </span>
    </div>
  );
}

export function VideoHero({ onEnter, heroImage }: VideoHeroProps) {
  const { t } = useLanguage();
  const videos = MEDIA.heroVideos;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeSrc = videos[activeIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("x5-playsinline", "true");
    video.setAttribute("x5-video-player-type", "h5");

    setIsPlaying(false);
    video.load();

    const play = () => {
      void video.play().catch(() => {});
    };

    play();
    video.addEventListener("canplay", play);
    return () => video.removeEventListener("canplay", play);
  }, [activeSrc]);

  return (
    <section className="relative flex h-dvh w-full flex-col overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          unoptimized
          className={`object-cover object-center transition-opacity duration-700 ${
            isPlaying ? "opacity-0" : "animate-ken-burns opacity-100"
          }`}
          sizes="100vw"
        />
      </div>

      <video
        ref={videoRef}
        key={activeSrc}
        className="absolute inset-0 z-[1] h-full w-full object-cover object-center"
        src={activeSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onPlaying={() => setIsPlaying(true)}
        onEnded={() => setActiveIndex((index) => (index + 1) % videos.length)}
      />

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/35 via-black/10 to-black/45" />

      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col px-7 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))] sm:px-10">
        <p
          className={`text-center font-heading text-xl font-normal tracking-[0.06em] text-white sm:text-2xl ${textGlow}`}
        >
          {t.hero.welcome}
        </p>

        <div className="relative mx-auto mt-8 h-[8.5rem] w-full max-w-md sm:mt-10 sm:h-[10rem] sm:max-w-lg">
          <div className="absolute left-6 top-0 sm:left-10">
            <p
              className={`font-brush text-[3.25rem] leading-none text-white sm:text-6xl ${textGlow}`}
            >
              {HERO_HEADLINES.line1}
            </p>
          </div>
          <div className="absolute right-6 top-[3.75rem] text-right sm:right-10 sm:top-[4.5rem]">
            <p
              className={`font-brush text-[3.25rem] leading-none text-white sm:text-6xl ${textGlow}`}
            >
              {HERO_HEADLINES.line2}
            </p>
          </div>
        </div>

        <div className="flex-1" />

        <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-end gap-3 sm:gap-5">
          <HeroNameBlock
            nameZh={COUPLE.groom.zh}
            nameEn={COUPLE.groom.en}
            label={t.hero.groomLabel}
            align="left"
          />
          <span
            className={`font-brush pb-1 text-4xl leading-none text-[#e84b4b] sm:text-5xl ${textGlow}`}
            aria-hidden
          >
            囍
          </span>
          <HeroNameBlock
            nameZh={COUPLE.bride.zh}
            nameEn={COUPLE.bride.en}
            label={t.hero.brideLabel}
            align="right"
          />
        </div>

        <p
          className={`mb-6 text-center font-body text-sm font-light tracking-[0.28em] text-white/90 sm:text-base ${textGlow}`}
        >
          {WEDDING.heroDate}
        </p>

        <button
          type="button"
          onClick={onEnter}
          className={`pointer-events-auto mx-auto min-w-[8.5rem] border border-white/90 bg-white/20 px-8 py-2.5 font-body text-[11px] font-medium tracking-[0.32em] text-white uppercase shadow-[0_6px_24px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all hover:border-white hover:bg-white/30 active:scale-[0.98] sm:min-w-[9rem] sm:text-xs ${textGlow}`}
        >
          {t.hero.enter}
        </button>
      </div>
    </section>
  );
}
