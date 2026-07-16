"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { RSVPForm } from "@/components/RSVPForm";
import { StoryCountdown } from "@/components/story/StoryCountdown";
import {
  INVITE_AUDIO,
  INVITE_DECOR,
  INVITE_DESIGN,
  INVITE_HERO_VIDEO,
  INVITE_META,
  INVITE_PHOTOS,
} from "@/lib/invite-template";
import { useLanguage } from "@/lib/i18n/context";
import { DRESS_CODE_COLORS } from "@/lib/wedding";
import {
  configureInlineVideo,
  isWeChatBrowser,
  playVideoInWeChat,
} from "@/lib/wechat-video";

const { width: DW, height: DH } = INVITE_DESIGN;

function pct(n: number, base: number) {
  return `${(n / base) * 100}%`;
}

function Box({
  top,
  left,
  w,
  h,
  className = "",
  style,
  children,
}: {
  top: number;
  left: number;
  w: number;
  h?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={`invite-abs ${className}`}
      style={{
        top: pct(top, DH),
        left: pct(left, DW),
        width: pct(w, DW),
        ...(h != null ? { height: pct(h, DH) } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Photo({
  src,
  alt = "",
  top,
  left,
  w,
  h,
  priority = false,
  className = "",
}: {
  src: string;
  alt?: string;
  top: number;
  left: number;
  w: number;
  h: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Box top={top} left={left} w={w} h={h} className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        className="object-cover"
        sizes="(max-width: 430px) 100vw, 430px"
        draggable={false}
      />
    </Box>
  );
}

function HeroMedia({
  poster,
  top,
  left,
  w,
  h,
  playLabel,
}: {
  poster: string;
  top: number;
  left: number;
  w: number;
  h: number;
  playLabel: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);
  const [isWeChat, setIsWeChat] = useState(false);

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;
    configureInlineVideo(video);
    void playVideoInWeChat(video)?.catch(() => {
      if (isWeChatBrowser()) setNeedsTapToPlay(true);
    });
  }, [videoFailed]);

  useEffect(() => {
    setIsWeChat(isWeChatBrowser());
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    setIsPlaying(false);
    setNeedsTapToPlay(false);
    configureInlineVideo(video);
    video.load();
    tryPlay();

    const onCanPlay = () => tryPlay();
    video.addEventListener("canplay", onCanPlay);

    const tapTimer = window.setTimeout(() => {
      if (!video.paused && !video.ended) return;
      if (isWeChatBrowser()) setNeedsTapToPlay(true);
    }, 1500);

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      window.clearTimeout(tapTimer);
    };
  }, [tryPlay, videoFailed]);

  return (
    <Box top={top} left={left} w={w} h={h} className="invite-hero-media">
      <Image
        src={poster}
        alt=""
        fill
        unoptimized
        priority
        className={`object-cover transition-opacity duration-700 ${
          isPlaying && !videoFailed ? "opacity-0" : "opacity-100"
        }`}
        sizes="(max-width: 430px) 100vw, 430px"
        draggable={false}
      />
      {!videoFailed && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={INVITE_HERO_VIDEO}
          poster={poster}
          muted
          playsInline
          loop
          preload="auto"
          autoPlay={!isWeChat}
          onPlaying={() => {
            setIsPlaying(true);
            setNeedsTapToPlay(false);
          }}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setVideoFailed(true);
            setIsPlaying(false);
          }}
        />
      )}
      {needsTapToPlay && !videoFailed && (
        <button
          type="button"
          className="invite-hero-tap"
          aria-label={playLabel}
          onClick={() => {
            setNeedsTapToPlay(false);
            tryPlay();
          }}
        >
          ▶
        </button>
      )}
    </Box>
  );
}

function Decor({
  src,
  top,
  left,
  w,
  h,
  className = "",
}: {
  src: string;
  top: number;
  left: number;
  w: number;
  h: number;
  className?: string;
}) {
  return (
    <Box top={top} left={left} w={w} h={h} className={className}>
      <Image
        src={src}
        alt=""
        fill
        unoptimized
        className="object-contain"
        sizes="(max-width: 430px) 100vw, 430px"
        draggable={false}
      />
    </Box>
  );
}

function Txt({
  top,
  left,
  w,
  text,
  className = "",
  style,
}: {
  top: number;
  left: number;
  w: number;
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  if (!text.trim()) return null;
  return (
    <Box top={top} left={left} w={w} className={className} style={style}>
      {text.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line || "\u00A0"}
        </span>
      ))}
    </Box>
  );
}

function Dot({ top, left }: { top: number; left: number }) {
  return (
    <Box top={top} left={left} w={11} h={11} className="invite-dot" />
  );
}

function BgmToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const audio = new Audio(INVITE_AUDIO);
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  return (
    <button
      type="button"
      className={`invite-bgm ${on ? "invite-bgm--on" : ""}`}
      aria-label={on ? "暂停音乐" : "播放音乐"}
      onClick={() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (on) {
          audio.pause();
          setOn(false);
        } else {
          void audio.play().then(() => setOn(true)).catch(() => setOn(false));
        }
      }}
    >
      ♪
    </button>
  );
}

export function StoryInvitation() {
  const { t, locale } = useLanguage();
  const m = INVITE_META;
  const i = t.invite;
  const p = INVITE_PHOTOS;
  const d = INVITE_DECOR;
  const venueName = t.wedding.venue;
  const venueDetail = t.wedding.venueAddress;
  const isEn = locale === "en";
  const heroTagTop = isEn ? 192 : 198;
  const heroDateTop = isEn ? 268 : 236;

  return (
    <div className="invite-root">
      <BgmToggle />
      <div
        className="invite-canvas"
        style={{ aspectRatio: `${DW} / ${DH}` }}
      >
        {/* —— Hero —— */}
        <HeroMedia
          poster={p.hero}
          top={0}
          left={-4}
          w={384}
          h={610}
          playLabel={i.playVideo}
        />
        <Txt
          top={11}
          left={20}
          w={60}
          text={m.heroLine1}
          className="invite-en invite-en--sm invite-ink-white"
        />
        <Txt
          top={11}
          left={147}
          w={83}
          text={m.heroLine2}
          className="invite-en invite-en--sm invite-ink-white"
        />
        <Txt
          top={11}
          left={297}
          w={58}
          text={m.heroLine3}
          className="invite-en invite-en--sm invite-ink-white"
        />
        <Decor src={d.heroScript} top={55} left={50} w={276} h={131} />
        <Txt
          top={heroTagTop}
          left={0}
          w={375}
          text={i.heroTag}
          className={`invite-hero-tag invite-ink-white ${isEn ? "invite-en invite-hero-tag--en" : "invite-zh"}`}
          style={{ letterSpacing: isEn ? "0.06em" : "0.45em" }}
        />
        <Txt
          top={heroDateTop}
          left={0}
          w={375}
          text={m.dateDisplay}
          className={`invite-hero-date invite-ink-white ${isEn ? "invite-en invite-hero-date--en" : "invite-zh"}`}
          style={{ letterSpacing: isEn ? "0.14em" : "0.22em" }}
        />

        {/* Names under hero */}
        <Txt
          top={556}
          left={0}
          w={168}
          text={m.groomZh}
          className="invite-zh invite-zh--md invite-ink-white invite-hero-name text-right"
          style={{ letterSpacing: "0.08em" }}
        />
        <Txt
          top={556}
          left={172}
          w={32}
          text="/"
          className="invite-zh invite-zh--md invite-ink-white invite-hero-name text-center"
        />
        <Txt
          top={556}
          left={207}
          w={168}
          text={m.brideZh}
          className="invite-zh invite-zh--md invite-ink-white invite-hero-name text-left"
          style={{ letterSpacing: "0.08em" }}
        />
        <Txt
          top={576}
          left={0}
          w={168}
          text={m.groomEn}
          className="invite-en invite-en--sm invite-ink-white invite-hero-name text-right"
        />
        <Txt
          top={576}
          left={207}
          w={168}
          text={m.brideEn}
          className="invite-en invite-en--sm invite-ink-white invite-hero-name text-left"
        />

        <Dot top={632} left={182} />
        <Decor src={d.titleBanner} top={668} left={120} w={135} h={31} />
        <Txt
          top={708}
          left={0}
          w={375}
          text={i.inviteTitle}
          className="invite-zh invite-ink-black"
          style={{ letterSpacing: "0.6em" }}
        />
        <Txt
          top={760}
          left={0}
          w={375}
          text={i.inviteEn}
          className="invite-en invite-ink-black"
          style={{ letterSpacing: "0.35em" }}
        />

        {/* Strip + letter */}
        <Box top={782} left={-4} w={384} h={219} className="invite-block-black" />
        <Photo src={p.strip} top={794} left={-4} w={383} h={178} />
        <Txt
          top={982}
          left={0}
          w={375}
          text={i.stripQuote}
          className="invite-en invite-en--sm invite-ink-white"
        />
        <Txt
          top={1045}
          left={0}
          w={375}
          text={i.letter}
          className="invite-zh invite-ink-black"
          style={{ lineHeight: 2, letterSpacing: "0.12em" }}
        />
        <Txt
          top={1245}
          left={0}
          w={375}
          text={i.letterSecondary}
          className="invite-en invite-ink-black"
          style={{ lineHeight: 1.35 }}
        />

        <Dot top={1325} left={182} />
        <Decor src={d.sectionBanner} top={1358} left={98} w={180} h={33} />

        {/* Dual portraits */}
        <Photo src={p.portraitA} top={1415} left={32} w={144} h={206} />
        <Photo src={p.portraitB} top={1415} left={200} w={144} h={206} />
        <Txt
          top={1640}
          left={67}
          w={74}
          text="|"
          className="invite-zh invite-ink-black text-center"
        />
        <Txt
          top={1640}
          left={235}
          w={74}
          text="|"
          className="invite-zh invite-ink-black text-center"
        />
        <Txt
          top={1678}
          left={36}
          w={135}
          text={m.brideZh}
          className="invite-zh invite-zh--md invite-ink-black text-center"
          style={{ letterSpacing: "0.15em" }}
        />
        <Txt
          top={1678}
          left={204}
          w={135}
          text={m.groomZh}
          className="invite-zh invite-zh--md invite-ink-black text-center"
          style={{ letterSpacing: "0.15em" }}
        />
        <Txt
          top={1735}
          left={0}
          w={375}
          text={i.heartPoem}
          className="invite-zh invite-ink-black"
          style={{ lineHeight: 2, letterSpacing: "0.12em" }}
        />
        <Txt
          top={1855}
          left={0}
          w={375}
          text={i.heartPoemSecondary}
          className="invite-en invite-ink-black"
          style={{ lineHeight: 1.45 }}
        />
        <Txt
          top={1945}
          left={0}
          w={375}
          text={i.welcomeEn}
          className="invite-en invite-ink-black"
          style={{ letterSpacing: "0.35em" }}
        />

        {/* Photo stack on black */}
        <Box top={1985} left={-4} w={384} h={806} className="invite-block-black" />
        <Decor src={d.stackFrame} top={1980} left={-4} w={383} h={713} />
        <Photo src={p.stack1} top={2001} left={24} w={327} h={214} />
        <Txt
          top={2191}
          left={0}
          w={375}
          text={i.stackQuote1}
          className="invite-en invite-en--sm invite-ink-white"
          style={{ letterSpacing: "0.12em" }}
        />
        <Photo src={p.stack2} top={2230} left={24} w={327} h={214} />
        <Txt
          top={2421}
          left={0}
          w={375}
          text={i.stackQuote2}
          className="invite-en invite-en--sm invite-ink-white"
          style={{ letterSpacing: "0.12em" }}
        />
        <Photo src={p.stack3} top={2458} left={24} w={327} h={214} />
        <Txt
          top={2650}
          left={0}
          w={375}
          text={i.stackQuote3}
          className="invite-en invite-en--sm invite-ink-white"
          style={{ letterSpacing: "0.08em" }}
        />

        <Box top={2688} left={0} w={375} h={85} className="invite-countdown-wrap">
          <StoryCountdown />
        </Box>

        <Photo src={p.tall} top={2800} left={49} w={299} h={425} />
        <Decor src={d.leaf1} top={2818} left={21} w={20} h={54} />
        <Decor src={d.leaf2} top={2975} left={21} w={20} h={54} />
        <Photo src={p.cutout} top={3047} left={-4} w={256} h={441} />
        <Decor src={d.leaf3} top={3133} left={23} w={16} h={65} />
        <Dot top={3267} left={350} />
        <Decor src={d.quoteBannerR} top={3314} left={199} w={162} h={35} />

        <Photo src={p.wide1} top={3510} left={-4} w={383} h={200} />
        <Photo src={p.wide2} top={3710} left={-4} w={383} h={200} />
        <Txt
          top={3880}
          left={0}
          w={375}
          text={i.inviteEn}
          className="invite-zh invite-zh--light invite-ink-white"
          style={{ letterSpacing: "0.2em" }}
        />

        <Dot top={3955} left={182} />
        <Decor src={d.quoteBannerC} top={3985} left={88} w={199} h={27} />
        <Txt
          top={4045}
          left={0}
          w={375}
          text={i.meet}
          className="invite-zh invite-zh--light invite-ink-black"
          style={{ lineHeight: 1.8, letterSpacing: "0.18em" }}
        />
        <Txt
          top={4140}
          left={0}
          w={375}
          text={i.meetSecondary}
          className="invite-en invite-ink-black"
          style={{ lineHeight: 1.45 }}
        />

        {/* Calendar photo — full image, no old polaroid frame */}
        <Photo
          src={p.calendarPhoto}
          top={4220}
          left={0}
          w={375}
          h={481}
          className="invite-calendar-shot"
        />
        <Txt
          top={4715}
          left={0}
          w={375}
          text={i.dateLong}
          className="invite-zh invite-ink-black"
          style={{ lineHeight: 1.8, letterSpacing: "0.12em" }}
        />

        <Dot top={4805} left={182} />
        <Decor src={d.venueBanner} top={4840} left={98} w={180} h={44} />

        <Photo
          src={p.hotelA}
          alt={venueName}
          top={4895}
          left={14}
          w={168}
          h={175}
          className="invite-hotel-shot invite-hotel-shot--a"
        />
        <Photo
          src={p.hotelB}
          alt={venueName}
          top={4945}
          left={193}
          w={168}
          h={175}
          className="invite-hotel-shot invite-hotel-shot--b"
        />
        <Txt
          top={5135}
          left={0}
          w={375}
          text={`${venueName}\n${venueDetail}`}
          className="invite-zh invite-ink-black"
          style={{ lineHeight: 1.8, letterSpacing: "0.12em" }}
        />
      </div>

      <section className="invite-dress" aria-label={t.dressCode.title}>
        <div className="invite-dress__banner">
          <Image
            src={d.dressCodeBanner}
            alt="DRESS CODE"
            width={787}
            height={204}
            unoptimized
            className="invite-dress__banner-img"
            draggable={false}
          />
        </div>
        <div className="invite-dress__swatches">
          {DRESS_CODE_COLORS.map((color, index) => (
            <div key={color.hex} className="invite-dress__swatch">
              <span
                className="invite-dress__chip"
                style={{ backgroundColor: color.hex }}
                title={t.dressCode.colors[index]}
              />
              <span className="invite-dress__chip-label">
                {t.dressCode.colors[index]}
              </span>
            </div>
          ))}
        </div>
        <ul className="invite-dress__list">
          {t.dressCode.guidance.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div id="rsvp" className="invite-rsvp">
        <RSVPForm />
      </div>

      <div className="invite-closing">
        <Image
          src={d.closingBanner}
          alt=""
          width={158}
          height={50}
          unoptimized
          className="mx-auto"
          draggable={false}
        />
      </div>
    </div>
  );
}
