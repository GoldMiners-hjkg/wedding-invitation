export type Locale = "en" | "zh-CN" | "zh-TW";

export const LOCALES: { id: Locale; label: string }[] = [
  { id: "zh-CN", label: "简" },
  { id: "zh-TW", label: "繁" },
  { id: "en", label: "EN" },
];

export interface GuideItem {
  icon: string;
  name: string;
  description: string;
  tag: string;
  tip?: string;
}

export interface RecommendationItem {
  icon: string;
  name: string;
  description: string;
  tag: string;
}

export interface Translations {
  meta: { title: string; description: string };
  wedding: {
    date: string;
    dateShort: string;
    venue: string;
    venueAddress: string;
    venueDetail: string;
    rsvpDeadline: string;
  };
  hero: {
    welcome: string;
    headline1: string;
    headline2: string;
    groomLabel: string;
    brideLabel: string;
    enter: string;
    tapToPlay: string;
  };
  transition: { quote: string; continue: string; close: string; back: string; tapHint: string };
  info: {
    families: string;
    request: string;
    when: string;
    where: string;
  };
  rsvp: {
    label: string;
    title: string;
    deadline: string;
    fullName: string;
    fullNamePlaceholder: string;
    attending: string;
    accept: string;
    decline: string;
    guests: string;
    guest: string;
    guestsPlural: string;
    hotel: string;
    hotelVenueNote: string;
    hotelYes: string;
    hotelNo: string;
    checkIn: string;
    checkInHint: string;
    confirmHotelTitle: string;
    confirmHotelOneNight: string;
    confirmHotelTwoNights: string;
    confirmHotelProceed: string;
    confirmHotelBack: string;
    hotelGuests: string;
    arrival: string;
    selectTime: string;
    flightOptional: string;
    flightNumber: string;
    flightArrival: string;
    airport: string;
    dietary: string;
    dietaryPlaceholder: string;
    note: string;
    notePlaceholder: string;
    submit: string;
    sending: string;
    thankYouAttending: string;
    thankYouDeclining: string;
    thankYouAttendingMsg: string;
    thankYouDecliningMsg: string;
    errName: string;
    errAttending: string;
    errCheckInDate: string;
    errSubmit: string;
    errNetwork: string;
  };
  arrivalTimes: string[];
  recommendations: {
    eyebrow: string;
    title: string;
    viewGuide: string;
    tabs: { dining: string; culture: string; wellness: string };
    items: {
      dining: RecommendationItem[];
      culture: RecommendationItem[];
      wellness: RecommendationItem[];
    };
  };
  dressCode: {
    eyebrow: string;
    title: string;
    colors: string[];
    guidance: string[];
  };
  footer: { withLove: string; guideLink: string };
  guide: {
    title: string;
    subtitle: string;
    intro: string;
    foodTitle: string;
    foodIntro: string;
    funTitle: string;
    funIntro: string;
    tipsTitle: string;
    tips: string[];
    backHome: string;
    food: GuideItem[];
    fun: GuideItem[];
  };
}
