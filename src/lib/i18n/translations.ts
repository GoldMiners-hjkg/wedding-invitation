import type { Locale, Translations } from "./types";
import { inviteCopy } from "./invite";

const en: Omit<Translations, "invite"> = {
  meta: {
    title: "Wedding Invitation",
    description: "You are cordially invited to celebrate with us.",
  },
  wedding: {
    date: "Sunday, January 24, 2027",
    dateShort: "01 · 24 · 2027",
    venue: "Kimpton Hainan Clear Water Bay",
    venueAddress:
      "No. 3-1 Haishi Road, Clear Water Bay Avenue, Yingzhou Town, Lingshui, Hainan 572400",
    venueDetail: "Waterfront resort · Ceremony · Reception · Dinner",
    rsvpDeadline: "December 24, 2026",
  },
  hero: {
    welcome: "Welcome to our wedding",
    headline1: "好久不见",
    headline2: "婚礼见~",
    groomLabel: "GROOM",
    brideLabel: "BRIDE",
    enter: "Enter",
    tapToPlay: "Tap to play video",
  },
  transition: {
    quote:
      "Where cathedral arches meet the ocean horizon — we begin our forever.",
    continue: "Continue",
    close: "Close",
    back: "Back",
    tapHint: "Hover to preview · release for fullscreen",
  },
  info: {
    families: "Together with their families",
    request: "request the pleasure of your company",
    when: "When",
    where: "Where",
  },
  rsvp: {
    label: "RSVP",
    title: "Will you join us?",
    deadline: "Please respond by",
    fullName: "Full Name",
    fullNamePlaceholder: "Your full name",
    attending: "Attending",
    accept: "Joyfully accepts",
    decline: "Regretfully declines",
    guests: "Number of Guests",
    guest: "guest",
    guestsPlural: "guests",
    hotel: "Hotel accommodation",
    hotelVenueNote:
      "Rooms at Kimpton Hainan Clear Water Bay (our wedding hotel)",
    hotelYes: "Yes, please",
    hotelNo: "No, thanks",
    checkIn: "Check-in date",
    checkInHint:
      "We only have rooms on 1/23 and 1/24. Please select the night(s) you need — if you're staying both nights, be sure to select both dates.",
    confirmHotelTitle: "Please confirm your hotel stay",
    confirmHotelOneNight:
      "You've selected 1 night: {dates}. Please double-check before submitting.",
    confirmHotelTwoNights:
      "You've selected 2 nights: {dates}. Please confirm both dates are correct.",
    confirmHotelProceed: "Confirm & Submit",
    confirmHotelBack: "Go back to edit",
    hotelGuests: "Guests staying",
    arrival: "Estimated Arrival (Wedding Day)",
    selectTime: "Select a time window",
    flightOptional: "Flight details (optional)",
    flightNumber: "Flight Number",
    flightArrival: "Arrival Time",
    airport: "Arriving Airport",
    dietary: "Dietary Requirements / Allergies",
    dietaryPlaceholder: "Vegetarian, nut allergy, etc.",
    note: "Note to the Couple",
    notePlaceholder: "A message, song request, or well wishes...",
    submit: "Submit RSVP",
    sending: "Sending...",
    thankYouAttending: "We can't wait to see you!",
    thankYouDeclining: "We'll miss you",
    thankYouAttendingMsg:
      "Thank you, {name}! Your RSVP has been received. We look forward to celebrating with you.",
    thankYouDecliningMsg:
      "Thank you for letting us know, {name}. We're sorry you can't make it — you'll be in our hearts on the day.",
    errName: "Please enter your full name",
    errAttending: "Please let us know if you're attending",
    errCheckInDate: "Please select a check-in date",
    errSubmit: "Something went wrong",
    errNetwork: "Network error — please try again",
  },
  arrivalTimes: [
    "Before 12:00 PM",
    "12:00 – 2:00 PM",
    "2:00 – 4:00 PM",
    "4:00 – 6:00 PM",
    "After 6:00 PM",
    "Not sure yet",
  ],
  recommendations: {
    eyebrow: "While You're Here",
    title: "Our Recommendations",
    viewGuide: "Explore nearby food & fun →",
    tabs: { dining: "Dining", culture: "Explore", wellness: "Unwind" },
    items: {
      dining: [
        {
          icon: "🦞",
          name: "Harbor Seafood House",
          description:
            "Catch-of-the-day and ocean views — reserve a table on the terrace.",
          tag: "Seafood",
        },
        {
          icon: "🐚",
          name: "The Oyster Bar",
          description:
            "Fresh oysters and chilled wine — perfect after a beach stroll.",
          tag: "Oysters",
        },
        {
          icon: "🍹",
          name: "Sunset Tiki Lounge",
          description:
            "Tropical cocktails and small plates with front-row sunset seats.",
          tag: "Cocktails",
        },
      ],
      culture: [
        {
          icon: "🏖️",
          name: "Hidden Cove Beach",
          description:
            "A quiet stretch of sand — ideal for a morning walk or golden-hour photos.",
          tag: "Beach",
        },
        {
          icon: "⛵",
          name: "Coastal Sail Tour",
          description:
            "A gentle afternoon sail along the shoreline — book ahead in season.",
          tag: "Sailing",
        },
        {
          icon: "🐋",
          name: "Marine Discovery Center",
          description:
            "Local sea life exhibits and coastal ecology — great for all ages.",
          tag: "Marine",
        },
      ],
      wellness: [
        {
          icon: "🧘",
          name: "Oceanfront Yoga",
          description:
            "Morning sessions with the sound of waves — mats provided.",
          tag: "Yoga",
        },
        {
          icon: "💆",
          name: "Sea Salt Spa",
          description:
            "Seaweed wraps and mineral baths inspired by the coast.",
          tag: "Spa",
        },
        {
          icon: "🌅",
          name: "Sunrise Cliff Walk",
          description:
            "A scenic coastal trail — best at dawn before the day warms up.",
          tag: "Scenic",
        },
      ],
    },
  },
  dressCode: {
    eyebrow: "Dress Code",
    title: "What to Wear",
    colors: ["Linen", "Taupe", "Pearl Grey", "Blush Pink", "Light Grey Blue"],
    guidance: [
      "Dress comfortably — wear whatever feels right for you.",
      "Soft tones from our palette are welcome: linen, taupe, pearl grey, blush pink, or light grey blue.",
      "Check the forecast before you travel and layer up or down for the weather.",
      "Oceanfront ceremony — wedges, block heels, or comfortable flats work well.",
      "Kindly avoid all-white or all-black so the couple remains the focus.",
    ],
  },
  footer: { withLove: "With love", guideLink: "Destination guide" },
  guide: {
    title: "Destination Guide",
    subtitle: "Dining · Culture · Wellness",
    intro:
      "If you're staying a few extra days, here are our favorite restaurants, experiences, and quiet moments near the venue.",
    foodTitle: "Where to Eat",
    foodIntro: "Fresh seafood and ocean-view dining — reservations recommended on weekends.",
    funTitle: "What to Do",
    funIntro: "Beaches, boats, coastal trails, and hidden coves worth exploring.",
    tipsTitle: "Practical Tips",
    tips: [
      "Bring sunscreen and sunglasses — coastal sun is strong even in winter.",
      "Sand-friendly footwear helps for the ceremony and beach walks.",
      "Book waterfront restaurants early — sunset tables go fast.",
      "Check tide times if you plan a morning beach visit.",
    ],
    backHome: "← Back to invitation",
    food: [
      {
        icon: "🦞",
        name: "Harbor Seafood House",
        description:
          "The local favorite for grilled catch and harbor views. Ask for the terrace.",
        tag: "Seafood",
        tip: "Try the chef's daily catch.",
      },
      {
        icon: "🐚",
        name: "The Oyster Bar",
        description:
          "Shucked-to-order oysters and crisp white wine — arrive before sunset.",
        tag: "Oysters",
      },
      {
        icon: "🍣",
        name: "Coastal Omakase",
        description:
          "Intimate sushi counter featuring local fish — small seats, book ahead.",
        tag: "Japanese",
      },
      {
        icon: "🥥",
        name: "Palm Court Café",
        description:
          "Light brunch and tropical smoothies steps from the beach.",
        tag: "Brunch",
      },
      {
        icon: "🍹",
        name: "Sunset Tiki Lounge",
        description:
          "Cocktails at golden hour with live acoustic music on weekends.",
        tag: "Bar",
      },
    ],
    fun: [
      {
        icon: "🏖️",
        name: "Hidden Cove Beach",
        description:
          "Soft sand and calm water — our favorite spot for a quiet afternoon.",
        tag: "Beach",
      },
      {
        icon: "🤿",
        name: "Reef Snorkel Tour",
        description:
          "Guided snorkel along the coastal reef — gear included, all levels welcome.",
        tag: "Snorkel",
        tip: "Morning trips have the clearest water.",
      },
      {
        icon: "⛵",
        name: "Sunset Sail",
        description:
          "A two-hour sail along the coast — champagne toast included.",
        tag: "Sailing",
      },
      {
        icon: "🥾",
        name: "Cliffside Coastal Trail",
        description:
          "Dramatic ocean views on a well-marked path — allow 90 minutes round trip.",
        tag: "Hiking",
      },
      {
        icon: "🛶",
        name: "Kayak the Bay",
        description:
          "Rent kayaks and paddle the calm inner bay — perfect for beginners.",
        tag: "Kayak",
      },
    ],
  },
};

const zhCN: Omit<Translations, "invite"> = {
  meta: { title: "婚礼邀请函", description: "诚挚邀请您与我们共同庆祝。" },
  wedding: {
    date: "2027年1月24日 星期日",
    dateShort: "2027 · 01 · 24",
    venue: "海南清水湾金普顿酒店",
    venueAddress: "海南省陵水黎族自治县英州镇清水湾大道海丝路3号-1",
    venueDetail: "临海度假酒店 · 仪式 · 香槟接待 · 晚宴",
    rsvpDeadline: "2026年12月24日",
  },
  hero: {
    welcome: "Welcome to our wedding",
    headline1: "好久不见",
    headline2: "婚礼见~",
    groomLabel: "GROOM",
    brideLabel: "BRIDE",
    enter: "进入",
    tapToPlay: "点击播放视频",
  },
  transition: {
    quote: "当教堂拱廊遇见海平线——我们的永远，从这里开始。",
    continue: "继续",
    close: "关闭",
    back: "返回",
    tapHint: "划过照片放大，松手全屏查看",
  },
  info: {
    families: "携双方家人",
    request: "恭请光临",
    when: "时间",
    where: "地点",
  },
  rsvp: {
    label: "出席确认",
    title: "您是否出席？",
    deadline: "请于以下日期前回复",
    fullName: "姓名",
    fullNamePlaceholder: "请输入您的全名",
    attending: "是否出席",
    accept: "欣然出席",
    decline: "遗憾缺席",
    guests: "宾客人数",
    guest: "位",
    guestsPlural: "位",
    hotel: "是否需要酒店住宿",
    hotelVenueNote: "入住海南清水湾金普顿酒店（婚礼举办酒店）",
    hotelYes: "需要",
    hotelNo: "不需要",
    checkIn: "入住日期",
    checkInHint:
      "我们仅提供 1/23 和 1/24 两晚住宿。请选择您需要的晚数；若两晚都住，请同时勾选两个日期。",
    confirmHotelTitle: "请确认入住信息",
    confirmHotelOneNight:
      "您选择了入住 1 晚：{dates}。请再次确认后提交。",
    confirmHotelTwoNights:
      "您选择了入住 2 晚：{dates}。请确认两晚均已勾选无误。",
    confirmHotelProceed: "确认并提交",
    confirmHotelBack: "返回修改",
    hotelGuests: "入住人数",
    arrival: "预计到达时间（婚礼当天）",
    selectTime: "请选择时间段",
    flightOptional: "航班信息（选填）",
    flightNumber: "航班号",
    flightArrival: "到达时间",
    airport: "到达机场",
    dietary: "饮食要求 / 过敏",
    dietaryPlaceholder: "素食、坚果过敏等",
    note: "给新人的留言",
    notePlaceholder: "祝福、点歌或想说的话……",
    submit: "提交回复",
    sending: "提交中……",
    thankYouAttending: "期待与您相见！",
    thankYouDeclining: "我们会想念您",
    thankYouAttendingMsg:
      "感谢 {name}！我们已收到您的回复，期待与您共同庆祝。",
    thankYouDecliningMsg:
      "感谢 {name} 告知我们。虽遗憾您无法出席，但您的心意我们铭记于心。",
    errName: "请输入您的姓名",
    errAttending: "请选择是否出席",
    errCheckInDate: "请选择入住日期",
    errSubmit: "提交失败，请重试",
    errNetwork: "网络错误，请稍后再试",
  },
  arrivalTimes: [
    "12:00 前",
    "12:00 – 14:00",
    "14:00 – 16:00",
    "16:00 – 18:00",
    "18:00 后",
    "暂不确定",
  ],
  recommendations: {
    eyebrow: "在此停留",
    title: "我们的推荐",
    viewGuide: "查看滨海好吃好玩 →",
    tabs: { dining: "美食", culture: "探索", wellness: "休闲" },
    items: {
      dining: [
        {
          icon: "🦞",
          name: "港湾海鲜坊",
          description: "当日渔获配海景露台，建议预约户外座位。",
          tag: "海鲜",
        },
        {
          icon: "🐚",
          name: "生蚝小馆",
          description: "现开生蚝配冰酒，散完步来一杯最惬意。",
          tag: "生蚝",
        },
        {
          icon: "🍹",
          name: "日落 Tiki 酒廊",
          description: "热带鸡尾酒与小食，坐拥一线日落。",
          tag: "鸡尾酒",
        },
      ],
      culture: [
        {
          icon: "🏖️",
          name: "隐秘湾海滩",
          description: "安静沙滩，适合晨间漫步或拍摄金色时刻。",
          tag: "海滩",
        },
        {
          icon: "⛵",
          name: "沿岸帆船之旅",
          description: "午后沿海缓航，旺季建议提前预约。",
          tag: "帆船",
        },
        {
          icon: "🐋",
          name: "海洋探索中心",
          description: "本地海洋生态展览，老少皆宜。",
          tag: "海洋",
        },
      ],
      wellness: [
        {
          icon: "🧘",
          name: "海景瑜伽",
          description: "伴着浪声的晨间课程，提供瑜伽垫。",
          tag: "瑜伽",
        },
        {
          icon: "💆",
          name: "海盐 Spa",
          description: "海藻裹体与矿物浴，灵感来自海洋。",
          tag: "水疗",
        },
        {
          icon: "🌅",
          name: "悬崖海岸步道",
          description: "风景绝美的沿海步道，建议清晨出发。",
          tag: "观景",
        },
      ],
    },
  },
  dressCode: {
    eyebrow: "着装要求",
    title: "穿什么",
    colors: ["亚麻", "灰褐", "珍珠灰", "柔粉", "浅灰蓝"],
    guidance: [
      "穿着舒适自在即可，按自己的喜好来就好。",
      "欢迎我们的色系：亚麻、灰褐、珍珠灰、柔粉或浅灰蓝。",
      "建议出发前查看当地天气，根据气温适时增减衣物。",
      "海边仪式，坡跟、粗跟或舒适平底鞋皆可。",
      "请避免全白或全黑，让新人成为焦点。",
    ],
  },
  footer: { withLove: "致意", guideLink: "目的地指南" },
  guide: {
    title: "目的地指南",
    subtitle: "美食 · 探索 · 休憩",
    intro:
      "若您多留几日，以下是我们精选的餐厅、体验与静谧时刻，都在婚礼场地附近。",
    foodTitle: "好吃",
    foodIntro: "新鲜海鲜与海景餐厅——周末建议提前预约。",
    funTitle: "好玩",
    funIntro: "沙滩、帆船、海岸步道与隐秘海湾，值得探索。",
    tipsTitle: "实用贴士",
    tips: [
      "海边阳光强烈，请备好防晒与墨镜。",
      "仪式在沙地举行，建议穿适合沙滩的鞋款。",
      "海景餐厅日落位抢手，请尽早订位。",
      "若计划清晨去沙滩，留意潮汐时间。",
    ],
    backHome: "← 返回邀请函",
    food: [
      {
        icon: "🦞",
        name: "港湾海鲜坊",
        description: "本地口碑海鲜餐厅，露台位可俯瞰港口，推荐每日渔获。",
        tag: "海鲜",
        tip: "试试主厨当日推荐。",
      },
      {
        icon: "🐚",
        name: "生蚝小馆",
        description: "现开生蚝配白葡萄酒，日落前到访最佳。",
        tag: "生蚝",
      },
      {
        icon: "🍣",
        name: "滨海 Omakase",
        description: "小而精的寿司吧台，以本地渔获为主，座位有限需预约。",
        tag: "日料",
      },
      {
        icon: "🥥",
        name: "棕榈庭院咖啡",
        description: "轻食早午餐与热带果昔，距海滩仅数步。",
        tag: "早午餐",
      },
      {
        icon: "🍹",
        name: "日落 Tiki 酒廊",
        description: "黄金时刻的鸡尾酒，周末有现场吉他。",
        tag: "酒吧",
      },
    ],
    fun: [
      {
        icon: "🏖️",
        name: "隐秘湾海滩",
        description: "细软沙滩与平静海水，我们最爱的午后去处。",
        tag: "海滩",
      },
      {
        icon: "🤿",
        name: "礁石浮潜之旅",
        description: "导览浮潜沿海礁石，含装备，各水平均可参加。",
        tag: "浮潜",
        tip: "上午水质最清澈。",
      },
      {
        icon: "⛵",
        name: "日落帆船",
        description: "两小时沿岸航行，含香槟祝酒。",
        tag: "帆船",
      },
      {
        icon: "🥾",
        name: "悬崖海岸步道",
        description: "壮阔海景步道，往返约 90 分钟。",
        tag: "徒步",
      },
      {
        icon: "🛶",
        name: "内湾皮划艇",
        description: "在内湾平静水域划 kayak，新手友好。",
        tag: "皮划艇",
      },
    ],
  },
};

const zhTW: Omit<Translations, "invite"> = {
  meta: { title: "婚禮邀請函", description: "誠摯邀請您與我們共同慶祝。" },
  wedding: {
    date: "2027年1月24日 星期日",
    dateShort: "2027 · 01 · 24",
    venue: "海南清水灣金普頓酒店",
    venueAddress: "海南省陵水黎族自治縣英州鎮清水灣大道海絲路3號-1",
    venueDetail: "臨海度假酒店 · 儀式 · 香檳接待 · 晚宴",
    rsvpDeadline: "2026年12月24日",
  },
  hero: {
    welcome: "Welcome to our wedding",
    headline1: "好久不见",
    headline2: "婚礼见~",
    groomLabel: "GROOM",
    brideLabel: "BRIDE",
    enter: "進入",
    tapToPlay: "點擊播放視頻",
  },
  transition: {
    quote: "當教堂拱廊遇見海平線——我們的永遠，從這裡開始。",
    continue: "繼續",
    close: "關閉",
    back: "返回",
    tapHint: "劃過照片放大，鬆手全屏查看",
  },
  info: {
    families: "攜雙方家人",
    request: "恭請光臨",
    when: "時間",
    where: "地點",
  },
  rsvp: {
    label: "出席確認",
    title: "您是否出席？",
    deadline: "請於以下日期前回覆",
    fullName: "姓名",
    fullNamePlaceholder: "請輸入您的全名",
    attending: "是否出席",
    accept: "欣然出席",
    decline: "遺憾缺席",
    guests: "賓客人數",
    guest: "位",
    guestsPlural: "位",
    hotel: "是否需要飯店住宿",
    hotelVenueNote: "入住海南清水灣金普頓酒店（婚禮舉辦酒店）",
    hotelYes: "需要",
    hotelNo: "不需要",
    checkIn: "入住日期",
    checkInHint:
      "我們僅提供 1/23 和 1/24 兩晚住宿。請選擇您需要的晚數；若兩晚都住，請同時勾選兩個日期。",
    confirmHotelTitle: "請確認入住資訊",
    confirmHotelOneNight:
      "您選擇了入住 1 晚：{dates}。請再次確認後提交。",
    confirmHotelTwoNights:
      "您選擇了入住 2 晚：{dates}。請確認兩晚均已勾選無誤。",
    confirmHotelProceed: "確認並提交",
    confirmHotelBack: "返回修改",
    hotelGuests: "入住人數",
    arrival: "預計到達時間（婚禮當天）",
    selectTime: "請選擇時段",
    flightOptional: "航班資訊（選填）",
    flightNumber: "航班號",
    flightArrival: "到達時間",
    airport: "到達機場",
    dietary: "飲食要求 / 過敏",
    dietaryPlaceholder: "素食、堅果過敏等",
    note: "給新人的留言",
    notePlaceholder: "祝福、點歌或想說的話……",
    submit: "提交回覆",
    sending: "提交中……",
    thankYouAttending: "期待與您相見！",
    thankYouDeclining: "我們會想念您",
    thankYouAttendingMsg:
      "感謝 {name}！我們已收到您的回覆，期待與您共同慶祝。",
    thankYouDecliningMsg:
      "感謝 {name} 告知我們。雖遺憾您無法出席，但您的心意我們銘記於心。",
    errName: "請輸入您的姓名",
    errAttending: "請選擇是否出席",
    errCheckInDate: "請選擇入住日期",
    errSubmit: "提交失敗，請重試",
    errNetwork: "網路錯誤，請稍後再試",
  },
  arrivalTimes: [
    "12:00 前",
    "12:00 – 14:00",
    "14:00 – 16:00",
    "16:00 – 18:00",
    "18:00 後",
    "暫不確定",
  ],
  recommendations: {
    eyebrow: "在此停留",
    title: "我們的推薦",
    viewGuide: "查看濱海好吃好玩 →",
    tabs: { dining: "美食", culture: "探索", wellness: "休閒" },
    items: {
      dining: [
        {
          icon: "🦞",
          name: "港灣海鮮坊",
          description: "當日漁獲配海景露台，建議預約戶外座位。",
          tag: "海鮮",
        },
        {
          icon: "🐚",
          name: "生蠔小館",
          description: "現開生蠔配冰酒，散完步來一杯最愜意。",
          tag: "生蠔",
        },
        {
          icon: "🍹",
          name: "日落 Tiki 酒廊",
          description: "熱帶雞尾酒與小食，坐擁一線日落。",
          tag: "雞尾酒",
        },
      ],
      culture: [
        {
          icon: "🏖️",
          name: "隱秘灣海灘",
          description: "安靜沙灘，適合晨間漫步或拍攝金色時刻。",
          tag: "海灘",
        },
        {
          icon: "⛵",
          name: "沿岸帆船之旅",
          description: "午後沿海緩航，旺季建議提前預約。",
          tag: "帆船",
        },
        {
          icon: "🐋",
          name: "海洋探索中心",
          description: "本地海洋生態展覽，老少皆宜。",
          tag: "海洋",
        },
      ],
      wellness: [
        {
          icon: "🧘",
          name: "海景瑜伽",
          description: "伴著浪聲的晨間課程，提供瑜伽墊。",
          tag: "瑜伽",
        },
        {
          icon: "💆",
          name: "海鹽 Spa",
          description: "海藻裹體與礦物浴，靈感來自海洋。",
          tag: "水療",
        },
        {
          icon: "🌅",
          name: "懸崖海岸步道",
          description: "風景絕美的沿海步道，建議清晨出發。",
          tag: "觀景",
        },
      ],
    },
  },
  dressCode: {
    eyebrow: "著裝要求",
    title: "穿什麼",
    colors: ["亞麻", "灰褐", "珍珠灰", "柔粉", "淺灰藍"],
    guidance: [
      "穿著舒適自在即可，按自己的喜好來就好。",
      "歡迎我們的色系：亞麻、灰褐、珍珠灰、柔粉或淺灰藍。",
      "建議出發前查看當地天氣，根據氣溫適時增減衣物。",
      "海邊儀式，坡跟、粗跟或舒適平底鞋皆可。",
      "請避免全白或全黑，讓新人成為焦點。",
    ],
  },
  footer: { withLove: "致意", guideLink: "目的地指南" },
  guide: {
    title: "目的地指南",
    subtitle: "美食 · 探索 · 休憩",
    intro:
      "若您多留幾日，以下是我們精選的餐廳、體驗與靜謐時刻，都在婚禮場地附近。",
    foodTitle: "好吃",
    foodIntro: "新鮮海鮮與海景餐廳——週末建議提前預約。",
    funTitle: "好玩",
    funIntro: "沙灘、帆船、海岸步道與隱秘海灣，值得探索。",
    tipsTitle: "實用貼士",
    tips: [
      "海邊陽光強烈，請備好防曬與墨鏡。",
      "儀式在沙地舉行，建議穿適合沙地的鞋款。",
      "海景餐廳日落位搶手，請儘早訂位。",
      "若計劃清晨去沙灘，留意潮汐時間。",
    ],
    backHome: "← 返回邀請函",
    food: [
      {
        icon: "🦞",
        name: "港灣海鮮坊",
        description: "本地口碑海鮮餐廳，露台位可俯瞰港口，推薦每日漁獲。",
        tag: "海鮮",
        tip: "試試主廚當日推薦。",
      },
      {
        icon: "🐚",
        name: "生蠔小館",
        description: "現開生蠔配白葡萄酒，日落前到訪最佳。",
        tag: "生蠔",
      },
      {
        icon: "🍣",
        name: "濱海 Omakase",
        description: "小而精的壽司吧台，以本地漁獲為主，座位有限需預約。",
        tag: "日料",
      },
      {
        icon: "🥥",
        name: "棕櫚庭院咖啡",
        description: "輕食早午餐與熱帶果昔，距海灘僅數步。",
        tag: "早午餐",
      },
      {
        icon: "🍹",
        name: "日落 Tiki 酒廊",
        description: "黃金時刻的雞尾酒，週末有現場吉他。",
        tag: "酒吧",
      },
    ],
    fun: [
      {
        icon: "🏖️",
        name: "隱秘灣海灘",
        description: "細軟沙灘與平靜海水，我們最愛的午後去處。",
        tag: "海灘",
      },
      {
        icon: "🤿",
        name: "礁石浮潛之旅",
        description: "導覽浮潛沿海礁石，含裝備，各水平均可參加。",
        tag: "浮潛",
        tip: "上午水質最清澈。",
      },
      {
        icon: "⛵",
        name: "日落帆船",
        description: "兩小時沿岸航行，含香檳祝酒。",
        tag: "帆船",
      },
      {
        icon: "🥾",
        name: "懸崖海岸步道",
        description: "壯闊海景步道，往返約 90 分鐘。",
        tag: "徒步",
      },
      {
        icon: "🛶",
        name: "內灣獨木舟",
        description: "在內灣平靜水域划 kayak，新手友好。",
        tag: "獨木舟",
      },
    ],
  },
};

export const translations: Record<Locale, Translations> = {
  en: { ...en, invite: inviteCopy.en },
  "zh-CN": { ...zhCN, invite: inviteCopy["zh-CN"] },
  "zh-TW": { ...zhTW, invite: inviteCopy["zh-TW"] },
};

export function interpolate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}
