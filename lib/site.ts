// Shared content for the one-page site: courts, rates, questions and the pictures behind them.

export type CourtId = "twin" | "lakeridge" | "farmington" | "fern-park" | "east-hartford";

export interface Court {
  id: CourtId;
  name: string;
  short: string;
  town: string;
  sports: string;
  surface: string;
  note: string;
  calLink?: string; // set when bookings are open
  photo: PhotoId;
}

export const COURTS: Court[] = [
  {
    id: "twin",
    name: "Twin Lakes Beach Club",
    short: "Twin Lakes",
    town: "Salisbury",
    sports: "Tennis",
    surface: "Private outdoor courts",
    note: "For club members and their guests.",
    calLink: "thien.me/twin",
    photo: "twinCourt",
  },
  {
    id: "lakeridge",
    name: "Lakeridge",
    short: "Lakeridge",
    town: "Torrington",
    sports: "Tennis and pickleball",
    surface: "Indoor and outdoor hard courts",
    note: "Well kept courts in a quiet setting.",
    calLink: "thien.me/lakeridge",
    photo: "stillwater",
  },
  {
    id: "farmington",
    name: "Farmington Valley Racquet Club",
    short: "Farmington Valley",
    town: "Farmington",
    sports: "Tennis",
    surface: "Indoor hard courts",
    note: "Bookings open when the season starts.",
    photo: "hardCourts",
  },
  {
    id: "fern-park",
    name: "Fern Park Tennis Association",
    short: "Fern Park",
    town: "Connecticut",
    sports: "Tennis",
    surface: "Outdoor club courts",
    note: "Bookings open when the season starts.",
    photo: "net",
  },
  {
    id: "east-hartford",
    name: "East Hartford Racquet Club",
    short: "East Hartford",
    town: "East Hartford",
    sports: "Tennis",
    surface: "Club courts",
    note: "Bookings open when the season starts.",
    photo: "hardCourts",
  },
];

export const OPEN_COURTS = COURTS.filter((c) => c.calLink);

export function courtById(id: string | null | undefined): Court | undefined {
  return COURTS.find((c) => c.id === id);
}

export type PhotoId =
  | "twinLakes"
  | "twinView"
  | "twinCourt"
  | "twinEvening"
  | "stillwater"
  | "hardCourts"
  | "net"
  | "ball"
  | "felt"
  | "randsView";

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  credit: string;
  page?: string; // source page for found pictures; absent for Thien's own
  position?: string; // object-position
}

export const PHOTOS: Record<PhotoId, Photo> = {
  twinLakes: {
    src: "/images/twin-lakes-tree.jpg",
    width: 360,
    height: 480,
    alt: "A green tennis court at Twin Lakes Beach Club under a clear sky, a big tree and the lake behind it",
    caption: "Twin Lakes Beach Club, Salisbury",
    credit: "Thien",
    position: "50% 60%",
  },
  twinView: {
    src: "/images/twin-lakes-lake-view.jpg",
    width: 480,
    height: 360,
    alt: "Late afternoon sun over the courts at Twin Lakes Beach Club, the lake and hills beyond the fence",
    caption: "Late afternoon at Twin Lakes",
    credit: "Thien",
    position: "60% 50%",
  },
  twinCourt: {
    src: "/images/twin-lakes-court.jpg",
    width: 480,
    height: 360,
    alt: "Two side-by-side green courts at Twin Lakes Beach Club on a bright summer morning",
    caption: "The courts at Twin Lakes Beach Club",
    credit: "Thien",
    position: "50% 50%",
  },
  twinEvening: {
    src: "/images/twin-lakes-evening.jpg",
    width: 480,
    height: 360,
    alt: "The sun low over the Twin Lakes courts, with the lake shining past the far fence",
    caption: "Evening at Twin Lakes",
    credit: "Thien",
    position: "65% 50%",
  },
  stillwater: {
    src: "/images/stillwater-pond-torrington.jpg",
    width: 1920,
    height: 1440,
    alt: "Stillwater Pond in Torrington under a clear blue sky, trees along the far shore",
    caption: "Stillwater Pond, Torrington",
    credit: "John Phelan, CC BY 4.0",
    page: "https://commons.wikimedia.org/wiki/File:Stillwater_Pond,_Torrington_CT.jpg",
    position: "40% 50%",
  },
  hardCourts: {
    src: "/images/hard-courts.jpg",
    width: 1920,
    height: 1095,
    alt: "Blue hard tennis courts seen through trees",
    caption: "Hard courts in early summer",
    credit: "RSMartinJr, CC0",
    page: "https://commons.wikimedia.org/wiki/File:Hanes_Park_hard_surface_tennis_courts,_2026.jpg",
    position: "70% 50%",
  },
  net: {
    src: "/images/tennis-net.jpg",
    width: 1920,
    height: 1442,
    alt: "A tennis net stretched across a clay court",
    caption: "A net on a clay court",
    credit: "Santeri Viinamäki, CC BY-SA 4.0",
    page: "https://commons.wikimedia.org/wiki/File:Tennis_net_20170619.jpg",
    position: "55% 50%",
  },
  ball: {
    src: "/images/tennis-ball.jpg",
    width: 1920,
    height: 1262,
    alt: "A yellow tennis ball resting on a clay court in front of the net",
    caption: "A ball on a clay court",
    credit: "Santeri Viinamäki, CC BY-SA 4.0",
    page: "https://commons.wikimedia.org/wiki/File:Tennis_ball_on_tennis_court_20170619.jpg",
    position: "30% 60%",
  },
  felt: {
    src: "/images/ball-felt.jpg",
    width: 1920,
    height: 979,
    alt: "Rubber tennis ball halves beside finished balls covered in felt",
    caption: "How a tennis ball is made",
    credit: "Mx. Granger, CC0",
    page: "https://commons.wikimedia.org/wiki/File:Tennis_ball_blanks_and_felt.jpg",
    position: "70% 50%",
  },
  randsView: {
    src: "/images/rands-view-salisbury.jpg",
    width: 1920,
    height: 748,
    alt: "Rolling fields and distant hills under scattered clouds at Rand's View, Salisbury",
    caption: "Rand's View, Salisbury",
    credit: "Collectionsbalsorano, CC BY-SA 4.0",
    page: "https://commons.wikimedia.org/wiki/File:Rand%27s_View_Connecticut.jpg",
    position: "50% 50%",
  },
};

export const RATES = {
  hourly: 100,
  sessions: [
    { name: "60 minutes", price: 100, note: "One focus, done properly: a stroke, a pattern, a habit." },
    { name: "90 minutes", price: 150, note: "Room for drilling and then playing points with it." },
  ],
  payment: [
    { name: "Venmo", detail: "@thienmtran", href: "https://venmo.com/thienmtran" },
    { name: "Cash", detail: "At the court" },
  ],
};

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Who do you coach?",
    a: "Every level. Kids and adults, from beginners picking up a racket for the first time to competitive players who want their game to hold up in matches.",
  },
  {
    q: "Tennis or pickleball?",
    a: "Both, same philosophy. Pickleball lessons are at Lakeridge in Torrington; tennis is at Twin Lakes and Lakeridge.",
  },
  {
    q: "How long is a lesson?",
    a: "60 or 90 minutes, one on one, at $100 an hour.",
  },
  {
    q: "How does booking work?",
    a: "Pick a court and a time in the calendar. I text you to confirm, and again if anything changes.",
  },
  {
    q: "Can anyone play at Twin Lakes?",
    a: "Twin Lakes Beach Club courts are private, so lessons there are for members and their guests. Lakeridge is open to book.",
  },
  {
    q: "What do we work on?",
    a: "Technique, footwork and match strategy, plus the mental game: the habits that hold up when the score is close.",
  },
  {
    q: "How do I pay?",
    a: "Venmo or cash, whichever is easier.",
  },
  {
    q: "What about Farmington Valley, Fern Park and East Hartford?",
    a: "All three open when their season starts. Email me and I will tell you the day the calendar goes live.",
  },
  {
    q: "What are your credentials?",
    a: "RSPA certified, a 4.5 USTA rating and a 4.4 DUPR rating, with more than eight years of coaching.",
  },
];

export const EMAIL = "hello@thien.me";
export const VENMO = "https://venmo.com/thienmtran";
