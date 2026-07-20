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
  playAudioInWeChat,
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
  style,
}: {
  src: string;
  top: number;
  left: number;
  w: number;
  h: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Box top={top} left={left} w={w} h={h} className={className} style={style}>
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
  const userPausedRef = useRef(false);
  const unlockedRef = useRef(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.preload = "auto";
    audio.setAttribute("playsinline", "true");
    audio.setAttribute("webkit-playsinline", "true");
    audio.load();

    const tryPlay = () => {
      if (userPausedRef.current || !audioRef.current) {
        return Promise.resolve(false);
      }

      return playAudioInWeChat(audioRef.current).then((played) => {
        if (!played || audioRef.current?.paused) {
          setOn(false);
          return false;
        }

        unlockedRef.current = true;
        setOn(true);
        return true;
      });
    };

    const unlockOnGesture = () => {
      if (unlockedRef.current || userPausedRef.current) return;
      void tryPlay().then((ok) => {
        if (ok) removeUnlockListeners();
      });
    };

    const removeUnlockListeners = () => {
      window.removeEventListener("pointerdown", unlockOnGesture, true);
      window.removeEventListener("touchstart", unlockOnGesture, true);
      window.removeEventListener("touchend", unlockOnGesture, true);
      window.removeEventListener("click", unlockOnGesture, true);
      window.removeEventListener("scroll", unlockOnGesture, true);
      window.removeEventListener("wheel", unlockOnGesture, true);
      window.removeEventListener("keydown", unlockOnGesture, true);
    };

    const onCanPlay = () => {
      void tryPlay();
    };

    const unlockOptions: AddEventListenerOptions = { capture: true, passive: true };
    window.addEventListener("pointerdown", unlockOnGesture, unlockOptions);
    window.addEventListener("touchstart", unlockOnGesture, unlockOptions);
    window.addEventListener("touchend", unlockOnGesture, unlockOptions);
    window.addEventListener("click", unlockOnGesture, unlockOptions);
    window.addEventListener("scroll", unlockOnGesture, unlockOptions);
    window.addEventListener("wheel", unlockOnGesture, unlockOptions);
    window.addEventListener("keydown", unlockOnGesture, unlockOptions);
    audio.addEventListener("canplaythrough", onCanPlay, { once: true });
    void tryPlay();

    return () => {
      removeUnlockListeners();
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.pause();
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={INVITE_AUDIO}
        preload="auto"
        loop
        aria-hidden
        style={{ display: "none" }}
      />
      <button
        type="button"
        className={`invite-bgm ${on ? "invite-bgm--on" : ""}`}
        aria-label={on ? "暂停音乐" : "播放音乐"}
        onClick={(e) => {
          e.stopPropagation();
          const audio = audioRef.current;
          if (!audio) return;
          if (on) {
            userPausedRef.current = true;
            audio.pause();
            setOn(false);
          } else {
            userPausedRef.current = false;
            void audio
              .play()
              .then(() => {
                unlockedRef.current = true;
                setOn(true);
              })
              .catch(() => setOn(false));
          }
        }}
      >
        ♪
      </button>
    </>
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
  const bodyFont = isEn ? "invite-en" : "invite-zh";
  const bodyMd = isEn ? "invite-en invite-en--md" : "invite-zh invite-zh--md";
  const hasPoemSecondary = Boolean(i.heartPoemSecondary.trim());
  const hasMeetSecondary = Boolean(i.meetSecondary.trim());
  /** Tighter gap between English poem and WELCOME */
  const welcomeAfterPoemGap = 50;
  const poemSecondaryTop = 1876;
  const poemSecondaryLines = i.heartPoemSecondary.split("\n").length;
  const poemSecondaryHeight = poemSecondaryLines * 15 * 1.45;
  const welcomeBaseTop = 1945;
  const poemGap = hasPoemSecondary
    ? poemSecondaryTop + poemSecondaryHeight + welcomeAfterPoemGap - welcomeBaseTop
    : -90;
  const meetGap = hasMeetSecondary ? 0 : -80;
  const y = (top: number) => top + poemGap;
  const y2 = (top: number) => top + poemGap + meetGap;

  return (
    <div className={`invite-root${isEn ? " invite-root--en" : ""}`}>
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

        {/* Names under hero — EN leads with English names */}
        <Txt
          top={556}
          left={0}
          w={168}
          text={isEn ? m.groomEn : m.groomZh}
          className={`${bodyMd} invite-ink-white invite-hero-name text-right`}
          style={{ letterSpacing: isEn ? "0.04em" : "0.08em" }}
        />
        <Txt
          top={556}
          left={172}
          w={32}
          text="/"
          className={`${bodyMd} invite-ink-white invite-hero-name text-center`}
        />
        <Txt
          top={556}
          left={207}
          w={168}
          text={isEn ? m.brideEn : m.brideZh}
          className={`${bodyMd} invite-ink-white invite-hero-name text-left`}
          style={{ letterSpacing: isEn ? "0.04em" : "0.08em" }}
        />
        <Txt
          top={576}
          left={0}
          w={168}
          text={isEn ? m.groomZh : m.groomEn}
          className={`${isEn ? "invite-zh" : "invite-en invite-en--sm"} invite-ink-white invite-hero-name text-right`}
          style={isEn ? { fontSize: "clamp(11px, 3vw, 13px)" } : undefined}
        />
        <Txt
          top={576}
          left={207}
          w={168}
          text={isEn ? m.brideZh : m.brideEn}
          className={`${isEn ? "invite-zh" : "invite-en invite-en--sm"} invite-ink-white invite-hero-name text-left`}
          style={isEn ? { fontSize: "clamp(11px, 3vw, 13px)" } : undefined}
        />

        <Dot top={632} left={182} />
        <Decor src={d.titleBanner} top={662} left={120} w={135} h={31} />
        <Txt
          top={726}
          left={0}
          w={375}
          text={i.inviteTitle}
          className={`${bodyFont} invite-ink-black`}
          style={{ letterSpacing: isEn ? "0.12em" : "0.6em" }}
        />
        <Txt
          top={760}
          left={0}
          w={375}
          text={i.inviteEn}
          className="invite-en invite-ink-black"
          style={{ letterSpacing: "0.12em" }}
        />

        {/* Strip + letter */}
        <Box top={782} left={-4} w={384} h={219} className="invite-block-black" />
        <Photo src={p.strip} top={794} left={-4} w={383} h={178} />
        <Txt
          top={982}
          left={0}
          w={375}
          text={i.stripQuote}
          className="invite-en invite-ink-white"
          style={{ padding: "0 0.75rem", boxSizing: "border-box" }}
        />
        <Txt
          top={1045}
          left={0}
          w={375}
          text={i.letter}
          className={`${bodyFont} invite-ink-black`}
          style={{
            lineHeight: isEn ? 1.55 : 2,
            letterSpacing: isEn ? "0.04em" : "0.12em",
            padding: isEn ? "0 0.85rem" : undefined,
            boxSizing: "border-box",
          }}
        />
        <Decor
          src={d.seaweedVine}
          top={910}
          left={-83}
          w={120}
          h={420}
          className="invite-seaweed"
          style={{ transform: "scaleX(-1) rotate(12deg)" }}
        />
        <Decor
          src={d.seaweedVine}
          top={1040}
          left={338}
          w={120}
          h={420}
          className="invite-seaweed"
          style={{ transform: "rotate(12deg)" }}
        />
        <Txt
          top={isEn ? 1220 : 1245}
          left={0}
          w={375}
          text={i.letterSecondary}
          className="invite-en invite-ink-black"
          style={{ lineHeight: 1.45 }}
        />
        <Dot top={1340} left={182} />
        <Decor src={d.sectionBanner} top={1370} left={98} w={180} h={33} />

        {/* Dual portraits */}
        <Photo src={p.portraitA} top={1436} left={32} w={144} h={206} />
        <Photo src={p.portraitB} top={1436} left={200} w={144} h={206} />
        <Txt
          top={1661}
          left={67}
          w={74}
          text="|"
          className={`${bodyFont} invite-ink-black text-center`}
        />
        <Txt
          top={1661}
          left={235}
          w={74}
          text="|"
          className={`${bodyFont} invite-ink-black text-center`}
        />
        <Txt
          top={1699}
          left={36}
          w={135}
          text={isEn ? m.brideEn : m.brideZh}
          className={`${bodyMd} invite-ink-black text-center`}
          style={{ letterSpacing: isEn ? "0.04em" : "0.15em" }}
        />
        <Txt
          top={1699}
          left={204}
          w={135}
          text={isEn ? m.groomEn : m.groomZh}
          className={`${bodyMd} invite-ink-black text-center`}
          style={{ letterSpacing: isEn ? "0.04em" : "0.15em" }}
        />
        <Txt
          top={1756}
          left={0}
          w={375}
          text={i.heartPoem}
          className={`${bodyFont} invite-ink-black`}
          style={{
            lineHeight: isEn ? 1.5 : 2,
            letterSpacing: isEn ? "0.04em" : "0.12em",
            padding: isEn ? "0 0.85rem" : undefined,
            boxSizing: "border-box",
          }}
        />
        <Decor
          src={d.starfish}
          top={1766}
          left={8}
          w={78}
          h={76}
          className="invite-starfish"
        />
        <Decor
          src={d.starfish}
          top={1899}
          left={318}
          w={64}
          h={62}
          className="invite-starfish"
          style={{ transform: "rotate(-18deg)" }}
        />
        {hasPoemSecondary ? (
          <Txt
            top={1876}
            left={0}
            w={375}
            text={i.heartPoemSecondary}
            className="invite-en invite-ink-black"
            style={{ lineHeight: 1.45 }}
          />
        ) : null}
        <Txt
          top={y(1945)}
          left={0}
          w={375}
          text={i.welcomeEn}
          className="invite-en invite-ink-black"
          style={{ letterSpacing: "0.35em" }}
        />

        {/* Photo stack on black */}
        <Box top={y(1985)} left={-4} w={384} h={806} className="invite-block-black" />
        <Decor src={d.stackFrame} top={y(1980)} left={-4} w={383} h={713} />
        <Photo src={p.stack1} top={y(2001)} left={24} w={327} h={214} />
        <Txt
          top={y(2191)}
          left={0}
          w={375}
          text={i.stackQuote1}
          className="invite-en invite-ink-white"
          style={{ letterSpacing: "0.08em" }}
        />
        <Photo src={p.stack2} top={y(2230)} left={24} w={327} h={214} />
        <Txt
          top={y(2421)}
          left={0}
          w={375}
          text={i.stackQuote2}
          className="invite-en invite-ink-white"
          style={{ letterSpacing: "0.08em" }}
        />
        <Photo src={p.stack3} top={y(2458)} left={24} w={327} h={214} />
        <Txt
          top={y(2650)}
          left={0}
          w={375}
          text={i.stackQuote3}
          className="invite-en invite-ink-white"
          style={{ letterSpacing: "0.06em", padding: "0 0.5rem", boxSizing: "border-box" }}
        />

        <Box top={y(2688)} left={0} w={375} h={85} className="invite-countdown-wrap">
          <StoryCountdown />
        </Box>

        <Photo src={p.tall} top={y(2800)} left={49} w={299} h={425} />
        <Decor src={d.leaf1} top={y(2818)} left={21} w={20} h={54} />
        <Decor src={d.leaf2} top={y(2975)} left={21} w={20} h={54} />
        <Decor
          src={d.pearlOyster}
          top={y(3345)}
          left={230}
          w={220}
          h={172}
          className="invite-pearl"
        />
        <Photo
          src={p.cutout}
          top={y(3047)}
          left={-4}
          w={256}
          h={441}
          className="invite-cutout"
        />
        <Decor src={d.leaf3} top={y(3133)} left={23} w={16} h={65} />

        <Photo src={p.wide1} top={y(3510)} left={-4} w={383} h={200} />
        <Photo src={p.wide2} top={y(3710)} left={-4} w={383} h={200} />
        <Txt
          top={y(3880)}
          left={0}
          w={375}
          text={i.wideWelcomeEn}
          className="invite-en invite-ink-white"
          style={{ letterSpacing: "0.12em" }}
        />

        <Dot top={y(3955)} left={182} />
        <Decor src={d.quoteBannerC} top={y(3985)} left={88} w={199} h={27} />
        <Txt
          top={y(4045)}
          left={0}
          w={375}
          text={i.meet}
          className={`${bodyFont} invite-ink-black`}
          style={{
            lineHeight: isEn ? 1.5 : 1.8,
            letterSpacing: isEn ? "0.04em" : "0.18em",
            padding: isEn ? "0 0.85rem" : undefined,
            boxSizing: "border-box",
          }}
        />
        {hasMeetSecondary ? (
          <Txt
            top={y(4140)}
            left={0}
            w={375}
            text={i.meetSecondary}
            className="invite-en invite-ink-black"
            style={{ lineHeight: 1.45 }}
          />
        ) : null}

        {/* Calendar photo — full image, no old polaroid frame */}
        <Photo
          src={p.calendarPhoto}
          top={y2(4220)}
          left={0}
          w={375}
          h={493}
          className="invite-calendar-shot"
        />
        <Txt
          top={y2(4718)}
          left={0}
          w={375}
          text={i.dateLong}
          className={`${bodyFont} invite-ink-black`}
          style={{
            lineHeight: 1.7,
            letterSpacing: isEn ? "0.06em" : "0.12em",
          }}
        />
        <Dot top={y2(4788)} left={182} />
        <Decor src={d.venueBanner} top={y2(4818)} left={98} w={160} h={32} />

        <Photo
          src={p.hotelA}
          alt={venueName}
          top={y2(4883)}
          left={14}
          w={168}
          h={175}
          className="invite-hotel-shot invite-hotel-shot--a"
        />
        <Photo
          src={p.hotelB}
          alt={venueName}
          top={y2(4933)}
          left={193}
          w={168}
          h={175}
          className="invite-hotel-shot invite-hotel-shot--b"
        />
        <Txt
          top={y2(5120)}
          left={0}
          w={375}
          text={venueName}
          className={`${bodyMd} invite-venue-name`}
          style={{
            letterSpacing: isEn ? "0.04em" : "0.12em",
            padding: isEn ? "0 0.75rem" : undefined,
            boxSizing: "border-box",
          }}
        />
        <Txt
          top={y2(5152)}
          left={0}
          w={375}
          text={venueDetail}
          className={`${bodyFont} invite-ink-black invite-venue-address`}
          style={{
            lineHeight: 1.55,
            letterSpacing: isEn ? "0.03em" : "0.08em",
            padding: isEn ? "0 0.85rem" : "0 0.5rem",
            boxSizing: "border-box",
          }}
        />
      </div>

      <section className="invite-dress" aria-label={t.dressCode.title}>
        <span className="invite-section-dot" aria-hidden />
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
