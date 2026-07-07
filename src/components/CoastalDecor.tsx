"use client";

import Image from "next/image";

const ASSETS = {
  wave: "/images/coastal/coastal-wave.png",
  palm: "/images/coastal/coastal-palm.png",
  shell: "/images/coastal/coastal-shell.png",
  wineGlass: "/images/coastal/coastal-wine-glass.png",
  wineGlasses: "/images/coastal/coastal-wine-glasses-pair.png",
} as const;

type StaticSprite = {
  kind: "static";
  id: string;
  src: string;
  className: string;
  width: number;
  height: number;
};

type AnimatedSprite = {
  kind: "animated";
  id: string;
  src: string;
  wrapperClass: string;
  animClass: string;
  imageClass: string;
  width: number;
  height: number;
};

type CoastalSprite = StaticSprite | AnimatedSprite;

const SPRITES: CoastalSprite[] = [
  {
    kind: "animated",
    id: "palm-tl",
    src: ASSETS.palm,
    wrapperClass: "absolute -left-[10%] top-[1%] w-[26%] max-w-[108px]",
    animClass: "animate-palm-sway",
    imageClass: "opacity-[0.34]",
    width: 746,
    height: 977,
  },
  {
    kind: "static",
    id: "shell-tr",
    src: ASSETS.shell,
    className:
      "absolute right-[2%] top-[10%] w-[11%] max-w-[46px] rotate-[18deg] opacity-[0.4]",
    width: 848,
    height: 840,
  },
  {
    kind: "animated",
    id: "wine-tr",
    src: ASSETS.wineGlass,
    wrapperClass: "absolute right-[4%] top-[28%] w-[12%] max-w-[52px]",
    animClass: "animate-wine-glass-sway",
    imageClass: "opacity-[0.42]",
    width: 394,
    height: 940,
  },
  {
    kind: "static",
    id: "shell-ml",
    src: ASSETS.shell,
    className:
      "absolute left-[1%] top-[42%] w-[10%] max-w-[42px] -rotate-[14deg] opacity-[0.36]",
    width: 848,
    height: 840,
  },
  {
    kind: "animated",
    id: "wine-ml",
    src: ASSETS.wineGlasses,
    wrapperClass: "absolute left-[3%] top-[52%] w-[16%] max-w-[68px]",
    animClass: "animate-wine-glass-sway-alt",
    imageClass: "opacity-[0.38]",
    width: 762,
    height: 951,
  },
  {
    kind: "animated",
    id: "palm-br",
    src: ASSETS.palm,
    wrapperClass: "absolute -right-[8%] bottom-[16%] w-[24%] max-w-[100px]",
    animClass: "animate-palm-sway-alt",
    imageClass: "-scale-x-100 opacity-[0.32]",
    width: 746,
    height: 977,
  },
  {
    kind: "static",
    id: "shell-bl",
    src: ASSETS.shell,
    className:
      "absolute bottom-[20%] left-[3%] w-[9%] max-w-[38px] rotate-[8deg] opacity-[0.38]",
    width: 848,
    height: 840,
  },
  {
    kind: "static",
    id: "shell-mr",
    src: ASSETS.shell,
    className:
      "absolute right-[1%] top-[58%] w-[8%] max-w-[34px] -rotate-[22deg] opacity-[0.34]",
    width: 848,
    height: 840,
  },
  {
    kind: "animated",
    id: "wine-br",
    src: ASSETS.wineGlass,
    wrapperClass: "absolute bottom-[28%] right-[6%] w-[10%] max-w-[44px]",
    animClass: "animate-wine-glass-sway-alt",
    imageClass: "-scale-x-100 opacity-[0.36]",
    width: 394,
    height: 940,
  },
  {
    kind: "static",
    id: "wave-bottom",
    src: ASSETS.wave,
    className:
      "absolute -bottom-[2%] left-1/2 w-[108%] max-h-[min(13vh,68px)] max-w-none -translate-x-1/2 opacity-[0.28]",
    width: 1383,
    height: 712,
  },
];

/** Hand-drawn coastal accents — sparse edge scatter, clear center */
export function CoastalDecor({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {SPRITES.map((sprite) => {
        if (sprite.kind === "static") {
          return (
            <Image
              key={sprite.id}
              src={sprite.src}
              alt=""
              width={sprite.width}
              height={sprite.height}
              unoptimized
              draggable={false}
              className={`h-auto select-none ${sprite.className}`}
            />
          );
        }

        return (
          <div
            key={sprite.id}
            className={`${sprite.wrapperClass} ${sprite.animClass}`}
          >
            <Image
              src={sprite.src}
              alt=""
              width={sprite.width}
              height={sprite.height}
              unoptimized
              draggable={false}
              className={`h-auto w-full select-none ${sprite.imageClass}`}
            />
          </div>
        );
      })}
    </div>
  );
}
