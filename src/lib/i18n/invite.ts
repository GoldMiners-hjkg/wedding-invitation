import type { Locale } from "./types";

export type InviteCopy = {
  heroTag: string;
  inviteTitle: string;
  inviteEn: string;
  stripQuote: string;
  letter: string;
  letterSecondary: string;
  heartPoem: string;
  heartPoemSecondary: string;
  welcomeEn: string;
  wideWelcomeEn: string;
  stackQuote1: string;
  stackQuote2: string;
  stackQuote3: string;
  onlyYou: string;
  spring: string;
  meet: string;
  meetSecondary: string;
  dateLong: string;
  happiness: string;
  sweetEn: string;
  pride: string;
  openNav: string;
  playVideo: string;
  countdownDays: string;
  countdownHours: string;
  countdownMins: string;
  countdownSecs: string;
  weekdays: [string, string, string, string, string, string, string];
};

const inviteEn: InviteCopy = {
  heroTag: "See you at the wedding",
  inviteTitle: "Our Wedding Invitation",
  inviteEn: "To Our Friends And Family.",
  stripQuote:
    "As the clouds and mist dissipate, I love you and everyone knows it",
  letter:
    "This invitation is filled with our whole heart.\nYou who receive it\nare the most important people in our lives.\nWe sincerely invite you and your family to our wedding\nto witness our love.\nThank you for your care and support all along —\nwe look forward to welcoming you together.",
  letterSecondary:
    "Thank You For Celebrating Our Special Day,\nSupporting Us And Sharing Our Love.",
  heartPoem:
    "Like the tides that always find the shore,\nand the breeze that gently lingers,\nwe found each other.\nWe would be honored to celebrate this joy with you.",
  heartPoemSecondary: "",
  welcomeEn: "WELCOME TO OUR WEDDING",
  wideWelcomeEn: "WELCOME TO OUR WEDDING",
  stackQuote1: "I love three things in this world.",
  stackQuote2: "Sun, moon and you.",
  stackQuote3: "Sun for morning, moon for night, and you forever.",
  onlyYou:
    "There may be many beautiful things in this world\nbut the most beautiful in my heart is only you",
  spring:
    "/ May the spring breeze be gentle with you\nsweep away the restless, leave only tenderness",
  meet:
    "With the sea breeze as our witness\nand the endless ocean before us,\nwe begin the next chapter of our lives together.",
  meetSecondary: "",
  dateLong: "Sunday, January 24, 2027\nLunar Dec 17 · 15:00",
  happiness:
    '"The greatest happiness is placing my hand in yours\nand walking with you\nthrough this romantic life"',
  sweetEn: "SWEET WEDDING INVITATION",
  pride:
    "/ To make our private romance public again and again\nis to feel, again and again, that having you is worth celebrating",
  openNav: "Open Maps",
  playVideo: "Play video",
  countdownDays: "Days",
  countdownHours: "Hrs",
  countdownMins: "Mins",
  countdownSecs: "Secs",
  weekdays: ["S", "M", "T", "W", "T", "F", "S"],
};

const inviteZhCN: InviteCopy = {
  heroTag: "婚礼见",
  inviteTitle: "我们的「婚礼邀请」",
  inviteEn: "To Our Friends And Family.",
  stripQuote:
    "As the clouds and mist dissipate, I love you and everyone knows it",
  letter:
    "这是一封心意满满的婚礼邀请函\n收到这封邀请函的你们\n都是我们人生中最重要的部分\n诚挚邀请您携家人参加我们的婚礼\n见证我们的爱情\n感谢您一直以来的支持与关爱\n我们携手期待着您的到来",
  letterSecondary:
    "Thank You For Celebrating Our Special Day,\nSupporting Us And Sharing Our Love.",
  heartPoem:
    "如潮汐终将相遇，\n如微风终将停留。\n我们找到了彼此，\n也期待与您分享这份幸福。",
  heartPoemSecondary:
    "Like the tides that always find the shore,\nand the breeze that gently lingers,\nwe found each other.\nWe would be honored to celebrate this joy with you.",
  welcomeEn: "WELCOME TO OUR WEDDING",
  wideWelcomeEn: "WELCOME TO OUR WEDDING",
  stackQuote1: "I love three things in this world.",
  stackQuote2: "Sun, moon and you.",
  stackQuote3: "Sun for morning, moon for night, and you forever.",
  onlyYou:
    "也许这世界上美好的事情很多\n但我心底最美好的人，只有你一个",
  spring: "/ 希望春风能对你温柔点\n拂去烦躁，满目皆是柔情",
  meet:
    "海风轻拂，浪花低语。\n在蓝天与大海的见证下，\n我们将携手展开人生新的篇章。",
  meetSecondary:
    "With the sea breeze as our witness\nand the endless ocean before us,\nwe begin the next chapter of our lives together.",
  dateLong: "2027年1月24日 星期日\n农历腊月十七 15:00",
  happiness:
    '"最大的幸福就是能把自己的手放在你的手心\n与你一起\n走完这浪漫的一生"',
  sweetEn: "SWEET WEDDING INVITATION",
  pride:
    "/ 一次又一次将私有浪漫公之于众\n是一次又一次觉得拥有你是值得炫耀的事",
  openNav: "打开导航",
  playVideo: "播放视频",
  countdownDays: "天",
  countdownHours: "时",
  countdownMins: "分",
  countdownSecs: "秒",
  weekdays: ["日", "一", "二", "三", "四", "五", "六"],
};

const inviteZhTW: InviteCopy = {
  heroTag: "婚禮見",
  inviteTitle: "我們的「婚禮邀請」",
  inviteEn: "To Our Friends And Family.",
  stripQuote:
    "As the clouds and mist dissipate, I love you and everyone knows it",
  letter:
    "這是一封心意滿滿的婚禮邀請函\n收到這封邀請函的你們\n都是我們人生中最重要的部分\n誠摯邀請您攜家人參加我們的婚禮\n見證我們的愛情\n感謝您一直以來的支持與關愛\n我們攜手期待著您的到來",
  letterSecondary:
    "Thank You For Celebrating Our Special Day,\nSupporting Us And Sharing Our Love.",
  heartPoem:
    "如潮汐終將相遇，\n如微風終將停留。\n我們找到了彼此，\n也期待與您分享這份幸福。",
  heartPoemSecondary:
    "Like the tides that always find the shore,\nand the breeze that gently lingers,\nwe found each other.\nWe would be honored to celebrate this joy with you.",
  welcomeEn: "WELCOME TO OUR WEDDING",
  wideWelcomeEn: "WELCOME TO OUR WEDDING",
  stackQuote1: "I love three things in this world.",
  stackQuote2: "Sun, moon and you.",
  stackQuote3: "Sun for morning, moon for night, and you forever.",
  onlyYou:
    "也許這世界上美好的事情很多\n但我心底最美好的人，只有你一個",
  spring: "/ 希望春風能對你溫柔點\n拂去煩躁，滿目皆是柔情",
  meet:
    "海風輕拂，浪花低語。\n在藍天與大海的見證下，\n我們將攜手展開人生新的篇章。",
  meetSecondary:
    "With the sea breeze as our witness\nand the endless ocean before us,\nwe begin the next chapter of our lives together.",
  dateLong: "2027年1月24日 星期日\n農曆臘月十七 15:00",
  happiness:
    "「最大的幸福就是能把自己的手放在你的手心\n與你一起\n走完這浪漫的一生」",
  sweetEn: "SWEET WEDDING INVITATION",
  pride:
    "/ 一次又一次將私有浪漫公之於眾\n是一次又一次覺得擁有你是值得炫耀的事",
  openNav: "打開導航",
  playVideo: "播放影片",
  countdownDays: "天",
  countdownHours: "時",
  countdownMins: "分",
  countdownSecs: "秒",
  weekdays: ["日", "一", "二", "三", "四", "五", "六"],
};

export const inviteCopy: Record<Locale, InviteCopy> = {
  en: inviteEn,
  "zh-CN": inviteZhCN,
  "zh-TW": inviteZhTW,
};
