"use client";

import { useState, useEffect, useCallback } from "react";

// ── TMDB poster base URL ──────────────────────────────────────────────────────
const TMDB = "https://image.tmdb.org/t/p";

type Movie = {
  id: number; title: string; year: number;
  genre: string; genres: string[];
  rating: number; note: string; poster: string;
};

// ── All movies ────────────────────────────────────────────────────────────────
const MOVIES: Movie[] = [
  // 2025/2026
  { id:1054867, title:"One Battle After Another",  year:2025, genre:"Action / Comedy",     genres:["Action","Comedy","Drama"],     rating:5, poster:"/A4ZSkAECzSIWFcPeFHnHVENdPOz.jpg", note:"PTA's best since There Will Be Blood. DiCaprio, Penn, and Del Toro in a bonkers epic about washed-up revolutionaries. Shot on VistaVision. The funniest serious movie I've seen." },
  { id:1233413, title:"Sinners",                   year:2025, genre:"Horror / Thriller",   genres:["Horror","Thriller"],           rating:5, poster:"/oDCis9fCymXNHnZLfBP7xHqUE3B.jpg", note:"Ryan Coogler fuses blues, vampires, and the Jim Crow South into something wholly original. That juke joint scene may be the sequence of the decade." },
  { id:687163,  title:"Project Hail Mary",         year:2026, genre:"Sci-Fi",              genres:["Sci-Fi"],                      rating:5, poster:"/uODfPzSVMYANDTxvKqPQqLuvlvt.jpg", note:"Ryan Gosling and an alien doing science together. Pure heart. The best sci-fi film in years and Gosling's finest work." },
  { id:1317288, title:"Marty Supreme",             year:2025, genre:"Drama / Sport",       genres:["Drama","Comedy"],              rating:4, poster:"/uqnKIHhJPNPpbFBa12v4iymqUBd.jpg", note:"Safdie's solo debut. Chalamet disappears into a ping-pong obsessive in 1950s New York. Completely unhinged in the best way." },
  { id:507086,  title:"The Fantastic Four: First Steps", year:2025, genre:"Superhero",    genres:["Action","Sci-Fi"],             rating:4, poster:"/8qP4D3G0JKaKSmTLFqV3xLgSBPM.jpg", note:"Finally a Fantastic Four that works. Retro-futurist aesthetic, great family chemistry, Galactus done right." },
  { id:975902,  title:"F1",                        year:2025, genre:"Action / Sport",      genres:["Action","Drama"],              rating:4, poster:"/6WxhEvFsauuACfv2s3SuSPVrT6J.jpg", note:"Pitt in a cockpit. Kosinski makes Formula One feel as tactile and immediate as Top Gun: Maverick." },
  { id:1258975, title:"Superman",                  year:2025, genre:"Superhero",           genres:["Action","Sci-Fi"],             rating:4, poster:"/mVUZKf88Y7S0DprtW8Vfr0fBcLY.jpg", note:"Gunn's Superman is warm, earnest, and genuinely fun. Corenswet nails the duality. The DCU is in good hands." },
  { id:696506,  title:"Mickey 17",                 year:2025, genre:"Sci-Fi / Comedy",     genres:["Sci-Fi","Comedy"],             rating:4, poster:"/7Z1GFbvB6MkUHJyGmtHl7WqS8J7.jpg", note:"Bong Joon-ho back in space. Pattinson playing multiple versions of himself. Bonkers, funny, and surprisingly moving." },

  // Crime & Thrillers
  { id:238,    title:"The Godfather",              year:1972, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"/3bhkrj58Vtu7enYsLegHnDmni2.jpg", note:"Perfect. The only word that applies." },
  { id:240,    title:"The Godfather Part II",      year:1974, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg", note:"Rare case where the sequel equals the original." },
  { id:769,    title:"Goodfellas",                 year:1990, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg", note:"The most entertaining crime film ever made. Every scene." },
  { id:1422,   title:"The Departed",               year:2006, genre:"Crime / Thriller",    genres:["Crime","Thriller"],            rating:5, poster:"/nT97ifVT2J1yMQmeq20Qblg61T.jpg", note:"Scorsese at his sharpest. That ending." },
  { id:524,    title:"Casino",                     year:1995, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"/6GF8SCRL1CKjzgJhpx3yJ9Kf3YM.jpg", note:"Scorsese, De Niro, Pesci. Three hours of neon and violence." },
  { id:500,    title:"Reservoir Dogs",             year:1992, genre:"Crime / Thriller",    genres:["Crime","Thriller"],            rating:5, poster:"/AjTtJNumZygemGl0JHZxhe9QIhV.jpg", note:"Tarantino's debut. Ear scene. 'Stuck in the Middle with You.'" },
  { id:16869,  title:"Inglourious Basterds",       year:2009, genre:"War / Drama",         genres:["War","Drama"],                 rating:5, poster:"/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg", note:"The basement bar scene and the cinema scene. Two of the greatest sequences in modern cinema." },
  { id:68718,  title:"Django Unchained",           year:2012, genre:"Western / Drama",     genres:["Western","Drama"],             rating:5, poster:"/5WJnIRRpz7lxKrOE0aVb6AORjdJ.jpg", note:"DiCaprio's best performance. Waltz's second-best. Foxx's finest hour." },
  { id:680,    title:"Pulp Fiction",               year:1994, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", note:"Changed what movies could do structurally. Still feels fresh." },
  { id:111,    title:"Scarface",                   year:1983, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:4, poster:"/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg", note:"Al Pacino at maximum. The original excess movie." },
  { id:278,    title:"The Shawshank Redemption",   year:1994, genre:"Drama",               genres:["Drama"],                       rating:5, poster:"/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", note:"The ending still lands. Every single time." },
  { id:77,     title:"Memento",                   year:2000, genre:"Thriller / Mystery",  genres:["Thriller","Mystery"],          rating:5, poster:"/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg", note:"Nolan's most purely clever film. Gets better every rewatch." },
  { id:1359,   title:"American Psycho",            year:2000, genre:"Thriller",            genres:["Thriller","Drama"],            rating:5, poster:"/9uGHEgsiUXjCNq8wdq4r49YL8A1.jpg", note:"Bale is operating in a different dimension. Business card scene forever." },
  { id:598,    title:"City of God",               year:2002, genre:"Crime / Drama",       genres:["Crime","Drama"],               rating:5, poster:"/k7eYdWvhYQyRQoU2TB2A2Xu2grZ.jpg", note:"The most kinetic crime film ever made. Rocket and Lil Zé are unforgettable." },
  { id:24,     title:"Kill Bill: Vol. 1",          year:2003, genre:"Action / Thriller",   genres:["Action","Thriller"],           rating:5, poster:"/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg", note:"Anime sequence. The Crazy 88. Relentless, beautiful violence." },
  { id:390043, title:"Molly's Game",               year:2017, genre:"Drama / Thriller",   genres:["Drama","Thriller"],            rating:4, poster:"/uLKiG7r10PnOEFEZNXGLfbWxRWI.jpg", note:"Sorkin writing at full speed. Chastain carries every scene." },
  { id:2976,   title:"The Talented Mr. Ripley",   year:1999, genre:"Thriller / Drama",    genres:["Thriller","Drama"],            rating:5, poster:"/jPOhXBJjzSvIIBL9gCR5wWaxqnp.jpg", note:"Damon, Law, Blanchett. Sun-drenched dread. One of the great psychological thrillers." },
  { id:11324,  title:"Shutter Island",             year:2010, genre:"Thriller / Mystery", genres:["Thriller","Drama"],            rating:4, poster:"/jBCKMqoXumZucmA15gHJiHJkaSB.jpg", note:"The twist recontextualises everything. First viewing is irreplaceable." },

  // Sci-Fi
  { id:27205,  title:"Inception",                  year:2010, genre:"Sci-Fi / Thriller",   genres:["Sci-Fi","Thriller"],          rating:5, poster:"/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg", note:"The spinning top. Still arguing about it. Nolan's most crowd-pleasing masterwork." },
  { id:157336, title:"Interstellar",               year:2014, genre:"Sci-Fi / Drama",      genres:["Sci-Fi","Drama"],             rating:5, poster:"/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", note:"The docking scene. The time dilation. Hans Zimmer's organ drone." },
  { id:603,    title:"The Matrix",                 year:1999, genre:"Sci-Fi / Action",     genres:["Sci-Fi","Action"],            rating:5, poster:"/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", note:"Changed cinema. The lobby scene. The Wachowskis at their peak." },
  { id:348,    title:"Alien",                      year:1979, genre:"Sci-Fi / Horror",     genres:["Sci-Fi","Horror"],            rating:5, poster:"/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg", note:"Still terrifying. Ridley Scott's claustrophobic masterpiece." },
  { id:872585, title:"Oppenheimer",                year:2023, genre:"Historical Drama",    genres:["Drama","History"],            rating:5, poster:"/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", note:"Three hours. Cillian Murphy in every frame. The Trinity test." },

  // Superhero / Action
  { id:155,    title:"The Dark Knight",            year:2008, genre:"Action / Thriller",   genres:["Action","Thriller"],          rating:5, poster:"/qJ2tW6WMUDux911r6m7haRef0WH.jpg", note:"Ledger's Joker is the ceiling. Nothing in the genre comes close." },
  { id:272,    title:"Batman Begins",              year:2005, genre:"Action / Thriller",   genres:["Action","Thriller"],          rating:4, poster:"/8RW2runSEc34IwKN6rVH1czEV7Q.jpg", note:"The one that made superhero movies serious again. Nolan's origin blueprint." },
  { id:557,    title:"Spider-Man",                 year:2002, genre:"Superhero",           genres:["Action"],                     rating:4, poster:"/gh4cZbhZxyTbgxQPxzPcZkIFSKh.jpg", note:"Raimi's original. Cheese and all, it holds up. 'With great power...'" },
  { id:98,     title:"Gladiator",                  year:2000, genre:"Action / Epic",       genres:["Action","Drama"],             rating:5, poster:"/ehGpAen7CYAt2QGnSBgABqczfcb.jpg", note:"Are you not entertained? Russell Crowe's best. Zimmer's score." },
  { id:9395,   title:"Remember the Titans",        year:2000, genre:"Drama / Sport",       genres:["Drama"],                      rating:4, poster:"/8G4JFnYcuTfQAiVNdSbZ7eVQOhN.jpg", note:"Denzel and a football team. The scene in Gettysburg gets me every time." },
  { id:1367,   title:"Rocky",                      year:1976, genre:"Drama / Sport",       genres:["Drama"],                      rating:5, poster:"/sRa8QpyoJsc3hEeU7RV7xoGh4CG.jpg", note:"Stallone wrote it in three days. It won Best Picture. Perfect." },

  // Classics
  { id:346,    title:"Seven Samurai",              year:1954, genre:"Drama / Adventure",   genres:["Drama","Action"],             rating:5, poster:"/8OKmBV5BUFzmozIC3pPWKHy17kx.jpg", note:"The template for every ensemble action film since. Kurosawa's peak." },
  { id:1366,   title:"One Flew Over the Cuckoo's Nest", year:1975, genre:"Drama",         genres:["Drama"],                      rating:5, poster:"/aar8oSmtKoSCVqCh3YhBqFbvXiQ.jpg", note:"Nicholson vs. Nurse Ratched. One of cinema's great battles of will." },
  { id:642,    title:"Butch Cassidy and the Sundance Kid", year:1969, genre:"Western",    genres:["Western","Comedy"],           rating:5, poster:"/ouvqRDrJhRFuMt6gUbQiMsKqm2i.jpg", note:"Newman and Redford. The best movie friendship ever put on screen." },

  // Animation
  { id:10681,  title:"WALL-E",                     year:2008, genre:"Animation / Sci-Fi",  genres:["Animation","Sci-Fi"],        rating:5, poster:"/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg", note:"The first 40 minutes is near-silent cinema. Pixar's absolute best." },
  { id:862,    title:"Toy Story",                  year:1995, genre:"Animation / Family",  genres:["Animation","Family"],        rating:5, poster:"/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg", note:"Changed everything. Still completely perfect." },
  { id:10193,  title:"Toy Story 3",                year:2010, genre:"Animation / Family",  genres:["Animation","Family"],        rating:5, poster:"/AbbXspMOwdviqbDGKuy6kUbr5FZ.jpg", note:"The furnace. Woody's gang holding hands. A film about growing up that wrecks adults." },
  { id:2062,   title:"Ratatouille",                year:2007, genre:"Animation / Family",  genres:["Animation","Family"],        rating:5, poster:"/npHNjldbeTHdKKw28bJKs7lzqzj.jpg", note:"Anyone can cook. The Anton Ego memory sequence is perfect cinema." },
  { id:8587,   title:"The Lion King",              year:1994, genre:"Animation / Family",  genres:["Animation","Family"],        rating:5, poster:"/sKCr78MXSuISjVFobuxe9X1HXMR.jpg", note:"Circle of Life, Mufasa's death, Be Prepared. Disney's peak." },
  { id:8392,   title:"My Neighbor Totoro",         year:1988, genre:"Animation / Fantasy", genres:["Animation","Fantasy"],       rating:5, poster:"/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg", note:"Miyazaki's gentlest film. Nothing bad happens. Pure warmth." },
  { id:129,    title:"Spirited Away",              year:2001, genre:"Animation / Fantasy", genres:["Animation","Fantasy"],       rating:5, poster:"/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", note:"The greatest animated film ever made. Not a debate." },
  { id:269149, title:"Zootopia",                   year:2016, genre:"Animation / Comedy",  genres:["Animation","Comedy"],        rating:4, poster:"/sM33SANp9zvmIBX8iQuFeff0d9q.jpg", note:"Better social commentary than most prestige dramas. And it's about bunnies." },
  { id:1087388,title:"Zootopia 2",                 year:2025, genre:"Animation / Comedy",  genres:["Animation","Comedy"],        rating:4, poster:"/v3QyboWRoA4O9RbcsqH8tJMe8EB.jpg", note:"Judy and Nick are back. Picks up without missing a beat." },
  { id:10191,  title:"How to Train Your Dragon",   year:2010, genre:"Animation / Adventure",genres:["Animation","Adventure"],    rating:4, poster:"/oKMHn1hR5drAZSFN6GGfBZEzYSs.jpg", note:"Hiccup and Toothless. The flying sequences are still breathtaking." },
  { id:10674,  title:"Mulan",                      year:1998, genre:"Animation / Adventure",genres:["Animation","Adventure"],   rating:4, poster:"/4OTYefcAlaShn6TGVK33UxLW9R7.jpg", note:"Reflection, I'll Make a Man Out of You. Disney's most badass heroine." },

  // Harry Potter
  { id:671,   title:"Harry Potter and the Sorcerer's Stone",   year:2001, genre:"Fantasy", genres:["Fantasy","Family"], rating:4, poster:"/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg", note:"The one that started everything. Still magical." },
  { id:672,   title:"Harry Potter and the Chamber of Secrets", year:2002, genre:"Fantasy", genres:["Fantasy","Family"], rating:3, poster:"/sdEOH0992YZ0QSxgXNIGLq1ToUi.jpg", note:"The weakest of the eight but Dobby is irreplaceable." },
  { id:673,   title:"Harry Potter and the Prisoner of Azkaban",year:2004, genre:"Fantasy", genres:["Fantasy","Family"], rating:5, poster:"/aWxwnYoe8p2d2fcxmCSdBBzozVJ.jpg", note:"Cuarón's entry. The best one. The time-turner sequence is perfect." },
  { id:674,   title:"Harry Potter and the Goblet of Fire",    year:2005, genre:"Fantasy", genres:["Fantasy","Family"], rating:4, poster:"/fECBqe2H0ytBrqZReJ6gMlNTHPi.jpg", note:"The Triwizard Tournament. Voldemort's return. The tone shifts for real." },
  { id:675,   title:"Harry Potter and the Order of the Phoenix",year:2007,genre:"Fantasy", genres:["Fantasy","Family"], rating:4, poster:"/5aOyjiCR5P5FfPaLQ7R7xKGPPuJ.jpg", note:"Umbridge is the most hatable villain. Sirius. The DA." },
  { id:767,   title:"Harry Potter and the Half-Blood Prince",  year:2009, genre:"Fantasy", genres:["Fantasy","Family"], rating:4, poster:"/kN1GHBfCjGcFNnAGI9xDIYI0d3e.jpg", note:"The cave sequence. Dumbledore's death. The series grows up." },
  { id:12444, title:"Harry Potter and the Deathly Hallows Pt 1",year:2010,genre:"Fantasy", genres:["Fantasy","Family"], rating:4, poster:"/maP4MTfPCeVD2FZnKEBNu2TIaKH.jpg", note:"The tent scenes. Dobby's death. A quiet, mournful film." },
  { id:12445, title:"Harry Potter and the Deathly Hallows Pt 2",year:2011,genre:"Fantasy", genres:["Fantasy","Family"], rating:5, poster:"/yFIne4cZCNKEHlMDcnFJM6fJFMN.jpg", note:"The Battle of Hogwarts. Snape's memories. The best ending to a franchise." },

  // More Drama
  { id:13,     title:"Forrest Gump",               year:1994, genre:"Drama",               genres:["Drama"],                     rating:5, poster:"/saHP97rTPS5eLmrLQEcANmKrsFl.jpg", note:"Life is like a box of chocolates. Somehow never gets old." },
  { id:489,    title:"Good Will Hunting",           year:1997, genre:"Drama",               genres:["Drama"],                     rating:5, poster:"/bABCl2MPA4pOVQm484HsEDC0X1Y.jpg", note:"It's not your fault. Damon and Affleck wrote something perfect." },
  { id:550,    title:"Fight Club",                  year:1999, genre:"Drama / Thriller",    genres:["Drama","Thriller"],          rating:5, poster:"/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", note:"The first rule. The twist. Still polarising." },
  { id:346698, title:"Barbie",                      year:2023, genre:"Comedy / Drama",      genres:["Comedy","Drama"],            rating:4, poster:"/iuFNMS8vlzmxg7WIxBGjoxntQ8.jpg", note:"Gerwig made a movie about the patriarchy inside a Mattel product. It works." },
  { id:424,    title:"Schindler's List",            year:1993, genre:"Historical Drama",    genres:["Drama","History"],           rating:5, poster:"/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", note:"Devastating. Watch it once. Remember it forever." },
  { id:57158,  title:"Drive",                       year:2011, genre:"Crime / Drama",       genres:["Crime","Drama"],             rating:5, poster:"/602vevIURmpjn17TEoZgkELf3Ys.jpg", note:"Almost no dialogue. Pure atmosphere. Gosling at his best." },
  { id:496243, title:"Parasite",                    year:2019, genre:"Thriller / Drama",    genres:["Thriller","Drama"],          rating:5, poster:"/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", note:"The staircase scene. The basement reveal. Bong Joon-ho." },
  { id:787699, title:"Challengers",                 year:2024, genre:"Drama / Sport",       genres:["Drama"],                     rating:5, poster:"/H6vke96LDvy6lVg3F8nmS40Tyhb.jpg", note:"Tennis has never looked this complicated. Or this good." },
  { id:106646, title:"The Wolf of Wall Street",     year:2013, genre:"Biography / Drama",   genres:["Drama","Comedy"],            rating:4, poster:"/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg", note:"Three hours that feel like ninety minutes." },
  { id:313369, title:"La La Land",                  year:2016, genre:"Musical / Romance",   genres:["Drama","Romance"],           rating:5, poster:"/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg", note:"The ending broke something in me. I haven't fixed it." },
  { id:389,    title:"12 Angry Men",                year:1957, genre:"Drama / Thriller",    genres:["Drama","Thriller"],          rating:5, poster:"/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg", note:"One room. Twelve people. Still riveting." },
];

// ── Types ─────────────────────────────────────────────────────────────────────
type SortKey = "year" | "rating" | "title";
type FilterKey = "All" | "Action" | "Animation" | "Comedy" | "Crime" | "Drama" | "Fantasy" | "History" | "Horror" | "Mystery" | "Romance" | "Sci-Fi" | "Thriller" | "War" | "Western";

const FILTERS: FilterKey[] = ["All","Action","Animation","Comedy","Crime","Drama","Fantasy","History","Horror","Mystery","Romance","Sci-Fi","Thriller","War","Western"];
const STARS = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

// ── Component ─────────────────────────────────────────────────────────────────
export default function MoviesPage() {
  const [active, setActive]   = useState<Movie | null>(null);
  const [sort, setSort]       = useState<SortKey>("year");
  const [dir, setDir]         = useState<"asc"|"desc">("desc");
  const [filter, setFilter]   = useState<FilterKey>("All");
  const [flipping, setFlipping] = useState(false);

  const close = useCallback(() => {
    setFlipping(true);
    setTimeout(() => { setActive(null); setFlipping(false); }, 400);
  }, []);

  const open = useCallback((m: Movie) => {
    setActive(m); setFlipping(false);
  }, []);

  // Esc to close
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [close]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  const toggleSort = (k: SortKey) => {
    if (sort === k) setDir(d => d === "asc" ? "desc" : "asc");
    else { setSort(k); setDir(k === "title" ? "asc" : "desc"); }
  };

  const list = [...MOVIES]
    .filter(m => filter === "All" || m.genres.includes(filter))
    .sort((a, b) => {
      const d = sort === "year"   ? a.year - b.year
              : sort === "rating" ? a.rating - b.rating
              : a.title.localeCompare(b.title);
      return dir === "asc" ? d : -d;
    });

  return (
    <div>
      {/* Hero ---------------------------------------------------------------- */}
      <section className="relative px-8 md:px-16 pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 flex items-start justify-end pointer-events-none select-none pr-6 md:pr-12 pt-12 overflow-hidden">
          <span className="font-display text-[22vw] font-light leading-none whitespace-nowrap opacity-[0.03]">watch</span>
        </div>
        <div className="relative z-10">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">Movies</p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Films I&apos;ve<br /><em className="text-primary">loved.</em>
          </h1>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            {MOVIES.length} films. Click any poster to flip it.
          </p>
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Controls ------------------------------------------------------------ */}
      <div className="px-8 md:px-16 py-5 flex flex-wrap gap-2 items-center border-b border-border/30">
        <div className="flex gap-1.5 items-center">
          <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mr-1">Sort</span>
          {(["year","rating","title"] as SortKey[]).map(k => (
            <button key={k} onClick={() => toggleSort(k)}
              className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${sort === k ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}>
              {k}{sort === k ? (dir === "desc" ? " ↓" : " ↑") : ""}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-border/50 mx-1 hidden sm:block" />
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-all ${filter === f ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}>
              {f}
            </button>
          ))}
        </div>
        <span className="font-mono text-[9px] text-muted-foreground/40 ml-auto">{list.length}</span>
      </div>

      {/* Grid --------------------------------------------------------------- */}
      <div className="px-8 md:px-16 py-8 pb-20">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
          {list.map(movie => (
            <button key={movie.id} onClick={() => open(movie)}
              className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label={movie.title}>
              {/* Poster — strict 2:3 ratio */}
              <div className="relative w-full rounded-lg overflow-hidden border border-border/30 bg-muted shadow-sm"
                style={{ paddingBottom: "150%" }}>
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${TMDB}/w342${movie.poster}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  {/* Hover shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 gap-0.5">
                    <span className="font-mono text-[9px] text-amber-400 leading-tight">{STARS(movie.rating)}</span>
                    <span className="font-mono text-[8px] text-white/70 leading-tight">{movie.year}</span>
                  </div>
                </div>
              </div>
              <p className="font-mono text-[8px] text-muted-foreground mt-1.5 truncate leading-tight px-0.5">{movie.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Card flip overlay ─────────────────────────────────────────────── */}
      {active && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-background/95 backdrop-blur-lg transition-opacity duration-300 ${flipping ? "opacity-0" : "opacity-100"}`}
          onClick={close}
          style={{ perspective: "1200px" }}
        >
          <div
            className={`relative w-full max-w-4xl transition-all duration-500 ${flipping ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
            style={{ transformStyle: "preserve-3d" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden border border-border shadow-2xl bg-card"
              style={{ maxHeight: "88vh" }}>

              {/* Poster panel */}
              <div className="md:w-[280px] shrink-0 bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${TMDB}/w500${active.poster}`}
                  alt={active.title}
                  className="w-full h-56 md:h-full object-cover"
                />
              </div>

              {/* Info panel */}
              <div className="flex-1 overflow-y-auto p-8 md:p-10 flex flex-col justify-center">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">
                  {active.year} · {active.genre}
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-3 leading-tight">
                  {active.title}
                </h2>
                <p className="font-mono text-base text-primary mb-6 tracking-wider">
                  {STARS(active.rating)}
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-md">
                  {active.note}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-6">
                  {active.genres.map(g => (
                    <span key={g} className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border/50">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Close */}
            <button onClick={close}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 flex items-center justify-center transition-all font-mono text-sm shadow-lg">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
