import { COUPLE, type CouplePerson } from "@/lib/couple";

interface PersonNameProps {
  person: CouplePerson;
  size?: "hero" | "large" | "medium";
  theme?: "light" | "overlay";
}

const heroShadow =
  "[text-shadow:0_0_50px_rgba(0,0,0,0.9),0_2px_10px_rgba(0,0,0,1),0_0_3px_rgba(0,0,0,1),0_0_1px_rgba(255,255,255,0.3)]";

const heroEnShadow =
  "[text-shadow:0_0_36px_rgba(0,0,0,0.9),0_1px_6px_rgba(0,0,0,1),0_0_2px_rgba(0,0,0,1)]";

const sizeClasses = {
  hero: {
    zh: `font-heading text-5xl font-normal leading-tight text-pearl sm:text-6xl md:text-7xl ${heroShadow}`,
    en: `mt-2 block font-body text-xs font-medium not-italic tracking-[0.28em] text-pearl sm:text-sm ${heroEnShadow}`,
  },
  large: {
    zh: "font-heading text-[1.65rem] font-normal leading-none sm:text-4xl md:text-5xl",
    en: "mt-1 block font-body text-[9px] font-light not-italic tracking-[0.18em] sm:mt-1.5 sm:text-[11px] sm:tracking-[0.22em]",
  },
  medium: {
    zh: "font-heading text-xl font-normal leading-none sm:text-2xl",
    en: "mt-1 block font-body text-[9px] font-light not-italic tracking-[0.16em] sm:text-[11px] sm:tracking-[0.18em]",
  },
};

export function PersonName({
  person,
  size = "large",
  theme = "light",
}: PersonNameProps) {
  const s = sizeClasses[size];
  const zhColor =
    size === "hero" ? "" : theme === "overlay" ? "text-pearl" : "text-wine";
  const enColor =
    size === "hero"
      ? ""
      : theme === "overlay"
        ? "text-champagne"
        : "text-wine-deep";

  return (
    <span className="inline-block shrink-0 text-center">
      <span className={`block ${zhColor} ${s.zh}`}>{person.zh}</span>
      <span className={`${enColor} ${s.en}`}>{person.en}</span>
    </span>
  );
}

interface CoupleNamesProps {
  size?: "hero" | "large" | "medium";
  theme?: "light" | "overlay";
  className?: string;
}

export function CoupleNames({
  size = "large",
  theme = "light",
  className = "",
}: CoupleNamesProps) {
  const isHero = size === "hero";

  return (
    <div
      className={`flex flex-row flex-nowrap items-end justify-center gap-2.5 sm:gap-6 ${className}`}
    >
      <PersonName person={COUPLE.groom} size={size} theme={theme} />
      <span
        className={`shrink-0 font-heading font-normal ${
          isHero
            ? `pb-1 text-2xl text-[#F2DFE1] sm:pb-0 sm:text-4xl ${heroShadow}`
            : size === "medium"
              ? "pb-0.5 text-base text-gold sm:text-lg"
              : "pb-0.5 text-xl text-gold sm:pb-1 sm:text-2xl md:text-3xl"
        }`}
      >
        &
      </span>
      <PersonName person={COUPLE.bride} size={size} theme={theme} />
    </div>
  );
}
