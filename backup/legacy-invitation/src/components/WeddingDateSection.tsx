"use client";

import Image from "next/image";
import { MEDIA } from "@/lib/wedding";

/** wedding-2 2.png calendar composite */
const PHOTO_ASPECT = 4002 / 2909;

export function WeddingDateSection() {
  return (
    <section className="bg-transparent pt-8 sm:pt-10">
      <div className="relative w-full pb-8 sm:pb-10">
        <div
          className="relative w-full"
          style={{ aspectRatio: PHOTO_ASPECT }}
        >
          <Image
            src={MEDIA.weddingDate}
            alt=""
            fill
            priority
            unoptimized
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
}
