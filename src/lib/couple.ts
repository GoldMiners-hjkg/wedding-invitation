export const COUPLE = {
  groom: { zh: "王哲", en: "Zhe Wang" },
  bride: { zh: "莊采縈", en: "Sabrina Chuang" },
} as const;

export type CouplePerson = (typeof COUPLE)[keyof typeof COUPLE];

/** Hero brush headlines — always simplified Chinese */
export const HERO_HEADLINES = {
  line1: "好久不见",
  line2: "婚礼见~",
} as const;
