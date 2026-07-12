export const MEDIA = {
  heroImage: "/mmexport1782503925618.jpg",
  heroVideos: ["/final.mp4"] as const,
  venue: "/image0.jpeg",
  hotelPhotos: ["/image0.jpeg", "/image1.jpeg"] as const,
  couple: "/couple-forest.jpg",
  /** Date section — photo + calendar composite */
  weddingDate: "/images/wedding-date-calendar.png?v=8",
  /** Page 2 — tap-to-enlarge gallery */
  transitionGallery: [
    "/couple-forest.jpg",
    "/mmexport1782503925618.jpg",
    "/mmexport1782503924096.jpg",
    "/mmexport1782503913964.jpg",
    "/mmexport1782503910502.jpg",
    "/mmexport1782503904802.jpg",
  ],
  guideFood: "/mmexport1782503904802.jpg",
  guideFun: "/mmexport1782503917157.jpg",
  /** AI-generated editorial ornaments (pearl + scallop shell) */
  ornaments: {
    crestLight: "/images/ornament-crest-light.png?v=2",
    crestHero: "/images/ornament-crest-hero.png?v=2",
    divider: "/images/ornament-divider.png?v=2",
    wave: "/images/ornament-wave.png?v=2",
  },
} as const;

export const WEDDING = {
  heroImage: MEDIA.heroImage,
  heroDate: "2027.01.24",
  /** Ceremony date — used for calendar highlight */
  year: 2027,
  month: 1,
  day: 24,
} as const;

/** Kimpton Aqeos Hainan — wedding venue & guest rooms */
export const HOTEL = {
  mapsUrl:
    "https://maps.google.com/?q=海南清水湾金普顿酒店+陵水+海丝路3号",
  phone: "+86-898-38320888",
} as const;

export const DRESS_CODE_COLORS = [
  { hex: "#EEE7DD" }, // Linen
  { hex: "#B8A99A" }, // Taupe
  { hex: "#E8E6E3" }, // Pearl Grey
  { hex: "#F2DFE1" }, // Blush Pink
  { hex: "#DCE6F3" }, // Light Grey Blue
] as const;

export const GUEST_COUNT_OPTIONS = [1, 2, 3, 4, 5] as const;

/** Hotel — only Jan 23 & 24, 2027; guests pick one or both */
export const HOTEL_CHECK_IN_DATE_OPTIONS = [
  { value: "2027-01-23", label: "1/23" },
  { value: "2027-01-24", label: "1/24" },
] as const;

export function parseHotelCheckInDates(
  stored: string | null | undefined,
): string[] {
  if (!stored?.trim()) return [];
  const allowed = new Set<string>(
    HOTEL_CHECK_IN_DATE_OPTIONS.map((item) => item.value),
  );
  return stored
    .split(",")
    .map((item) => item.trim())
    .filter((item) => allowed.has(item));
}

export function serializeHotelCheckInDates(dates: string[]): string {
  const allowed = HOTEL_CHECK_IN_DATE_OPTIONS.map((item) => item.value);
  return allowed.filter((value) => dates.includes(value)).join(",");
}

export function formatHotelCheckInDate(value: string): string {
  const option = HOTEL_CHECK_IN_DATE_OPTIONS.find((item) => item.value === value);
  return option?.label ?? value;
}

export function formatHotelCheckInDates(dates: string[]): string {
  return parseHotelCheckInDates(serializeHotelCheckInDates(dates))
    .map(formatHotelCheckInDate)
    .join(", ");
}

export function hotelNightCount(dates: string[]): number {
  return parseHotelCheckInDates(serializeHotelCheckInDates(dates)).length;
}
