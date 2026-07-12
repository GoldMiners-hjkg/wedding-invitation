"use client";

import Image from "next/image";
import { DividerOrnament } from "@/components/editorial/Ornaments";
import { MEDIA } from "@/lib/wedding";

/** wedding-2.png calendar composite */
const PHOTO_ASPECT = 4223 / 2911;

export function WeddingDateSection() {
  return (
    <section className="bg-transparent">
      <div className="flex justify-center px-6 pt-8 pb-4 sm:pt-10 sm:pb-5">
        <DividerOrnament />
      </div>

      <div className="px-[5%] pb-8 sm:px-[6%] sm:pb-10">
        <div
          className="relative mx-auto w-full max-h-[72dvh]"
          style={{ aspectRatio: PHOTO_ASPECT }}
        >
          <Image
            src={MEDIA.weddingDate}
            alt=""
            fill
            priority
            unoptimized
            className="object-contain object-center"
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
}
