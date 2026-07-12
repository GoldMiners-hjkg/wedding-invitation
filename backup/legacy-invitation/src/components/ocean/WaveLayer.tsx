import { ScallopShell } from "./icons";

interface WaveLayerProps {
  className?: string;
  variant?: "bottom" | "top";
  animated?: boolean;
}

export function WaveLayer({
  className = "",
  variant = "bottom",
  animated = true,
}: WaveLayerProps) {
  const flip = variant === "top" ? "rotate-180" : "";

  return (
    <div
      className={`pointer-events-none absolute left-0 w-full overflow-hidden leading-none ${variant === "bottom" ? "bottom-0" : "top-0"} ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`block h-16 w-full sm:h-24 ${flip} ${animated ? "animate-wave-drift" : ""}`}
      >
        <path
          fill="currentColor"
          fillOpacity="0.35"
          d="M0,64 C240,100 480,20 720,56 C960,92 1200,36 1440,64 L1440,120 L0,120 Z"
        />
      </svg>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`-mt-8 block h-14 w-full sm:-mt-12 sm:h-20 ${flip} ${animated ? "animate-wave-drift-reverse" : ""}`}
      >
        <path
          fill="currentColor"
          fillOpacity="0.55"
          d="M0,80 C360,40 720,100 1080,60 C1260,40 1380,70 1440,80 L1440,120 L0,120 Z"
        />
      </svg>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={`-mt-6 block h-10 w-full sm:-mt-8 sm:h-14 ${flip}`}
      >
        <path
          fill="currentColor"
          fillOpacity="0.85"
          d="M0,48 C480,80 960,16 1440,48 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  );
}

interface WaveDividerProps {
  fillClass?: string;
  bgClass?: string;
  flip?: boolean;
}

export function WaveDivider({
  fillClass = "text-ivory",
  bgClass = "bg-ink",
  flip = false,
}: WaveDividerProps) {
  return (
    <div className={`relative h-14 w-full sm:h-20 ${bgClass}`} aria-hidden>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={`absolute bottom-0 block h-full w-full ${flip ? "rotate-180" : ""} ${fillClass}`}
      >
        <path
          fill="currentColor"
          d="M0,32 C180,64 360,0 540,32 C720,64 900,0 1080,32 C1260,64 1440,16 1440,32 L1440,80 L0,80 Z"
        />
      </svg>
      <ScallopShell
        size={28}
        className="absolute bottom-2 left-[8%] text-sage/40 opacity-60"
      />
      <ScallopShell
        size={22}
        className="absolute bottom-1 right-[12%] text-gold/35 opacity-50"
      />
    </div>
  );
}
