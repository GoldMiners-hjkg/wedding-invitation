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
import { StoryCalendar } from "@/components/story/StoryCalendar";
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
  const { t } = useLanguage();
  const m = INVITE_META;
  const i = t.invite;
  const p = INVITE_PHOTOS;
  const d = INVITE_DECOR;
  const venueName = t.wedding.venue;
  const venueDetail = t.wedding.venueAddress;

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
          top={206}
          left={0}
          w={375}
          text={i.heroTag}
          className="invite-zh invite-ink-white"
          style={{ letterSpacing: "0.5em" }}
        />
        <Txt
          top={225}
          left={0}
          w={375}
          text={m.dateDisplay}
          className="invite-zh invite-zh--light invite-ink-white"
          style={{ letterSpacing: "0.2em" }}
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

        <Dot top={657} left={182} />
        <Decor src={d.titleBanner} top={715} left={120} w={135} h={31} />
        <Txt
          top={759}
          left={0}
          w={375}
          text={i.inviteTitle}
          className="invite-zh invite-ink-black"
          style={{ letterSpacing: "0.6em" }}
        />
        <Txt
          top={830}
          left={0}
          w={375}
          text={i.inviteEn}
          className="invite-en invite-ink-black"
          style={{ letterSpacing: "0.35em" }}
        />

        {/* Strip + letter */}
        <Box top={854} left={-4} w={384} h={219} className="invite-block-black" />
        <Photo src={p.strip} top={866} left={-4} w={383} h={178} />
        <Txt
          top={1047}
          left={0}
          w={375}
          text={i.stripQuote}
          className="invite-en invite-en--sm invite-ink-white"
        />
        <Txt
          top={1121}
          left={0}
          w={375}
          text={i.letter}
          className="invite-zh invite-ink-black"
          style={{ lineHeight: 2, letterSpacing: "0.12em" }}
        />
        <Txt
          top={1325}
          left={0}
          w={375}
          text={i.letterSecondary}
          className="invite-en invite-ink-black"
          style={{ lineHeight: 1.35 }}
        />

        <Dot top={1427} left={182} />
        <Decor src={d.sectionBanner} top={1471} left={112} w={151} h={33} />

        {/* Dual portraits */}
        <Photo src={p.portraitA} top={1567} left={32} w={144} h={206} />
        <Photo src={p.portraitB} top={1567} left={200} w={144} h={206} />
        <Txt
          top={1796}
          left={67}
          w={74}
          text="|"
          className="invite-zh invite-ink-black text-center"
        />
        <Txt
          top={1796}
          left={235}
          w={74}
          text="|"
          className="invite-zh invite-ink-black text-center"
        />
        <Txt
          top={1840}
          left={36}
          w={135}
          text={m.brideZh}
          className="invite-zh invite-zh--md invite-ink-black text-center"
          style={{ letterSpacing: "0.15em" }}
        />
        <Txt
          top={1840}
          left={204}
          w={135}
          text={m.groomZh}
          className="invite-zh invite-zh--md invite-ink-black text-center"
          style={{ letterSpacing: "0.15em" }}
        />
        <Txt
          top={1918}
          left={0}
          w={375}
          text={i.heartPoem}
          className="invite-zh invite-ink-black"
          style={{ lineHeight: 2, letterSpacing: "0.12em" }}
        />
        <Txt
          top={2044}
          left={0}
          w={375}
          text={i.heartPoemSecondary}
          className="invite-en invite-ink-black"
          style={{ lineHeight: 1.35 }}
        />
        <Txt
          top={2150}
          left={0}
          w={375}
          text={i.welcomeEn}
          className="invite-en invite-ink-black"
          style={{ letterSpacing: "0.35em" }}
        />

        {/* Photo stack on black */}
        <Box top={2181} left={-4} w={384} h={806} className="invite-block-black" />
        <Decor src={d.stackFrame} top={2176} left={-4} w={383} h={713} />
        <Photo src={p.stack1} top={2197} left={24} w={327} h={214} />
        <Txt
          top={2387}
          left={0}
          w={375}
          text={i.stackQuote1}
          className="invite-en invite-en--sm invite-ink-white"
          style={{ letterSpacing: "0.12em" }}
        />
        <Photo src={p.stack2} top={2426} left={24} w={327} h={214} />
        <Txt
          top={2617}
          left={0}
          w={375}
          text={i.stackQuote2}
          className="invite-en invite-en--sm invite-ink-white"
          style={{ letterSpacing: "0.12em" }}
        />
        <Photo src={p.stack3} top={2654} left={24} w={327} h={214} />
        <Txt
          top={2846}
          left={0}
          w={375}
          text={i.stackQuote3}
          className="invite-en invite-en--sm invite-ink-white"
          style={{ letterSpacing: "0.08em" }}
        />

        <Box top={2884} left={0} w={375} h={85} className="invite-countdown-wrap">
          <StoryCountdown />
        </Box>

        <Txt
          top={3048}
          left={0}
          w={375}
          text={i.onlyYou}
          className="invite-zh invite-zh--light invite-ink-black"
          style={{ lineHeight: 1.8, letterSpacing: "0.18em" }}
        />

        <Photo src={p.tall} top={3172} left={49} w={299} h={425} />
        <Decor src={d.leaf1} top={3190} left={21} w={20} h={54} />
        <Decor src={d.leaf2} top={3347} left={21} w={20} h={54} />
        <Photo src={p.cutout} top={3419} left={-4} w={256} h={441} />
        <Decor src={d.leaf3} top={3505} left={23} w={16} h={65} />
        <Dot top={3639} left={350} />
        <Decor src={d.quoteBannerR} top={3686} left={199} w={162} h={35} />
        <Txt
          top={3733}
          left={36}
          w={331}
          text={i.spring}
          className="invite-zh invite-zh--light invite-ink-black text-right"
          style={{ lineHeight: 1.8, letterSpacing: "0.12em" }}
        />

        <Photo src={p.wide1} top={3850} left={-4} w={383} h={200} />
        <Photo src={p.wide2} top={4049} left={-4} w={383} h={200} />
        <Txt
          top={4217}
          left={0}
          w={375}
          text={i.inviteEn}
          className="invite-zh invite-zh--light invite-ink-white"
          style={{ letterSpacing: "0.2em" }}
        />

        <Dot top={4305} left={182} />
        <Decor src={d.quoteBannerC} top={4336} left={88} w={199} h={27} />
        <Txt
          top={4401}
          left={0}
          w={375}
          text={i.meet}
          className="invite-zh invite-zh--light invite-ink-black"
          style={{ lineHeight: 1.8, letterSpacing: "0.18em" }}
        />
        <Txt
          top={4427}
          left={0}
          w={375}
          text={i.meetSecondary}
          className="invite-en invite-ink-black"
        />

        {/* Calendar block */}
        <Decor src={d.calendarFrame} top={4491} left={24} w={328} h={524} />
        <Photo src={p.calendarPhoto} top={4506} left={40} w={296} h={419} />
        <Box top={4631} left={25} w={325} h={325} className="invite-calendar-wrap">
          <StoryCalendar />
        </Box>
        <Txt
          top={4949}
          left={0}
          w={375}
          text={i.dateLong}
          className="invite-zh invite-ink-white"
          style={{ lineHeight: 1.8, letterSpacing: "0.12em" }}
        />

        <Txt
          top={5060}
          left={0}
          w={375}
          text={i.happiness}
          className="invite-zh invite-ink-black"
          style={{ lineHeight: 1.8, letterSpacing: "0.12em" }}
        />

        <Photo src={p.finale} top={5182} left={-4} w={383} h={647} />
        <Txt
          top={5187}
          left={0}
          w={375}
          text={i.sweetEn}
          className="invite-zh invite-ink-white"
          style={{ letterSpacing: "0.25em" }}
        />

        <Txt
          top={5793}
          left={0}
          w={375}
          text={i.pride}
          className="invite-zh invite-ink-black"
          style={{ lineHeight: 1.8, letterSpacing: "0.12em" }}
        />
        <Dot top={5931} left={182} />
        <Decor src={d.venueBanner} top={5973} left={98} w={180} h={44} />

        <Box top={6071} left={27} w={321} h={154} className="invite-map">
          <a
            href={m.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="invite-map__link"
          >
            <Image
              src={p.map}
              alt={venueName}
              fill
              unoptimized
              className="object-cover"
              sizes="320px"
            />
            <span className="invite-map__label">{i.openNav}</span>
          </a>
        </Box>
        <Txt
          top={6245}
          left={0}
          w={375}
          text={`${venueName}\n${venueDetail}`}
          className="invite-zh invite-ink-black"
          style={{ lineHeight: 1.8, letterSpacing: "0.12em" }}
        />
      </div>

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
