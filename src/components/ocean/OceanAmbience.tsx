import {
  Bubble,
  Dolphin,
  Pearl,
  PearlString,
  ScallopShell,
  Starfish,
} from "./icons";

interface OceanAmbienceProps {
  density?: "light" | "rich";
  /** Keep motifs in upper area — safe for pages with faces at bottom */
  topOnly?: boolean;
  className?: string;
}

/** Floating shells, pearls, dolphins, bubbles — decorative layer */
export function OceanAmbience({
  density = "light",
  topOnly = false,
  className = "",
}: OceanAmbienceProps) {
  const rich = density === "rich";
  const bottomClass = topOnly ? "hidden" : "";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <Dolphin className="animate-dolphin-glide absolute top-[10%] left-[2%] w-32 text-[#6BB8C4]/45 sm:w-44" />
      <Dolphin
        flip
        className="animate-dolphin-glide-reverse absolute top-[16%] right-[0%] w-28 text-[#6BB8C4]/35 sm:w-36"
      />

      <ScallopShell
        size={rich ? 64 : 52}
        className="animate-float-slow absolute top-[6%] left-[4%] text-gold/50 drop-shadow-sm"
      />
      <ScallopShell
        size={44}
        className="animate-float-slower absolute top-[14%] right-[5%] text-blush/55"
      />
      <Starfish
        size={rich ? 48 : 38}
        className={`animate-float-slow absolute bottom-[32%] left-[6%] text-sage/45 ${bottomClass}`}
      />
      <Starfish
        size={32}
        className={`animate-float-slower absolute bottom-[40%] right-[4%] text-gold/40 ${bottomClass}`}
      />

      <Pearl className="animate-bubble-rise absolute top-[38%] left-[14%]" size={12} />
      <Pearl className="animate-bubble-rise-delayed absolute top-[52%] right-[16%]" size={10} />
      <Pearl className="animate-bubble-rise absolute top-[28%] left-[48%]" size={9} />

      <Bubble className="animate-bubble-rise absolute top-[22%] left-[78%] text-ivory/40" size={22} />
      <Bubble className="animate-bubble-rise-delayed absolute top-[45%] left-[6%] text-ivory/35" size={16} />

      {rich && (
        <>
          <ScallopShell
            size={36}
            className={`animate-float-slower absolute bottom-[18%] right-[20%] text-sage/35 ${bottomClass}`}
          />
          <Bubble
            className={`animate-bubble-rise absolute top-[68%] right-[10%] text-ivory/30 ${bottomClass}`}
            size={18}
          />
          <Dolphin
            className={`animate-dolphin-glide absolute bottom-[22%] left-[24%] w-24 text-[#6BB8C4]/25 ${bottomClass}`}
          />
          <Pearl className="animate-bubble-rise-delayed absolute top-[18%] right-[38%]" size={8} />
        </>
      )}
    </div>
  );
}

export function OceanSectionHeader({
  children,
  className = "",
  theme = "light",
}: {
  children: React.ReactNode;
  className?: string;
  theme?: "light" | "dark";
}) {
  const shellColor = theme === "dark" ? "text-sage/60" : "text-sage/55";

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <ScallopShell size={28} className={shellColor} />
        <PearlString />
        <ScallopShell size={28} className={`scale-x-[-1] ${shellColor}`} />
      </div>
      {children}
      <div className="flex items-center gap-2 opacity-80 text-sage/50">
        <Pearl size={7} />
        <div className="h-px w-10 bg-sage/35" />
        <Starfish size={18} className={shellColor} />
        <div className="h-px w-10 bg-sage/35" />
        <Pearl size={7} />
      </div>
    </div>
  );
}

export function OceanCornerMotifs({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <ScallopShell
        size={40}
        className="animate-float-slow absolute bottom-4 left-3 text-sage/30 sm:bottom-6 sm:left-6"
      />
      <ScallopShell
        size={32}
        className="animate-float-slower absolute bottom-3 right-4 text-gold/35 sm:bottom-5 sm:right-8"
      />
      <Dolphin className="animate-dolphin-glide absolute bottom-8 left-1/2 w-20 -translate-x-1/2 text-sage/25 sm:w-28" />
    </div>
  );
}
