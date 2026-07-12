/**
 * Wedding invitation from hunbei template A17073ae6c057.
 *
 * Swap files under /public/images/invite/photos/ to use your own photos.
 * Copy (简/繁/英): src/lib/i18n/invite.ts
 * Decor/fonts/audio: see public/images/invite/ASSETS.md
 */

import { COUPLE } from "@/lib/couple";
import { HOTEL, MEDIA, WEDDING } from "@/lib/wedding";

const P = "/images/invite/photos";
const D = "/images/invite/decor";

/** Design canvas size from the original H5 (px) */
export const INVITE_DESIGN = { width: 375, height: 5700 } as const;

/** Replace these paths with your own files */
export const INVITE_PHOTOS = {
  /** Hero still — also used as video poster / failover */
  hero: `${P}/hero.jpg`,
  strip: `${P}/strip.jpg`,
  portraitA: `${P}/portrait-a.jpg`,
  portraitB: `${P}/portrait-b.jpg`,
  stack1: `${P}/stack-1.jpg`,
  stack2: `${P}/stack-2.jpg`,
  stack3: `${P}/stack-3.jpg`,
  tall: `${P}/tall.jpg`,
  cutout: `${P}/cutout.png`,
  wide1: `${P}/wide-1.jpg`,
  wide2: `${P}/wide-2.jpg`,
  calendarPhoto: `${P}/calendar-photo.jpg`,
  /** Hotel venue photos (replaces map) */
  hotelA: MEDIA.hotelPhotos[0],
  hotelB: MEDIA.hotelPhotos[1],
} as const;

/** Hero video — photo falls back if this fails to load/play */
export const INVITE_HERO_VIDEO = "/download/1000024922.mp4";

export const INVITE_DECOR = {
  heroScript: `${D}/hero-script.png`,
  titleBanner: `${D}/title-banner.png`,
  sectionBanner: `${D}/section-banner.png`,
  stackFrame: `${D}/stack-frame.png`,
  leaf1: `${D}/leaf-1.png`,
  leaf2: `${D}/leaf-2.png`,
  leaf3: `${D}/leaf-3.png`,
  quoteBannerR: `${D}/quote-banner-r.png`,
  quoteBannerC: `${D}/quote-banner-c.png`,
  calendarFrame: `${D}/calendar-frame.png`,
  venueBanner: `${D}/venue-banner.png`,
  dressCodeBanner: `${D}/dress-code-banner.png`,
  closingBanner: `${D}/closing-banner.png`,
} as const;

export const INVITE_AUDIO = "/images/invite/audio/bgm.mp3";

/** Shared non-translated invite constants */
export const INVITE_META = {
  heroLine1: "YOU ARE",
  heroLine2: "THE LOVE OF",
  heroLine3: "MY LIFE",
  dateDisplay: WEDDING.heroDate,
  groomZh: COUPLE.groom.zh,
  brideZh: COUPLE.bride.zh,
  groomEn: COUPLE.groom.en,
  brideEn: COUPLE.bride.en,
  mapsUrl: HOTEL.mapsUrl,
  phone: HOTEL.phone,
  year: WEDDING.year,
  month: WEDDING.month,
  day: WEDDING.day,
  ceremonyHour: 15,
} as const;
