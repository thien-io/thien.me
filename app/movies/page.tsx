"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";

const POSTER_BASE = "https://image.tmdb.org/t/p/w342";

// Hardcoded TMDB poster paths — stable, no API call needed
const POSTERS: Record<string, string> = {
  "The Shawshank Redemption":            "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
  "The Godfather":                       "/3bhkrj58Vtu7enYsLegHnDmni2.jpg",
  "The Dark Knight":                     "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "The Godfather Part II":               "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
  "12 Angry Men":                        "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
  "Schindler's List":                    "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
  "The Lord of the Rings: ROTK":         "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
  "Pulp Fiction":                        "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
  "Inception":                           "/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
  "The Matrix":                          "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  "Goodfellas":                          "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
  "Interstellar":                        "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  "The Silence of the Lambs":            "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
  "The Departed":                        "/nT97ifVT2J1yMQmeq20Qblg61T.jpg",
  "Saving Private Ryan":                 "/1wY4psJ5NVEhCuOYROwLH2XExM2.jpg",
  "Forrest Gump":                        "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
  "Good Will Hunting":                   "/bABCl2MPA4pOVQm484HsEDC0X1Y.jpg",
  "Fight Club":                          "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  "Spirited Away":                       "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
  "The Wolf of Wall Street":             "/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg",
  "Parasite":                            "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  "Drive":                               "/602vevIURmpjn17TEoZgkELf3Ys.jpg",
  "La La Land":                          "/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
  "Spider-Man: Into the Spider-Verse":   "/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
  "Avengers: Infinity War":              "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
  "Captain America: Civil War":          "/rAGiXaUfDVY7DDMBiaDY8hMbCEn.jpg",
  "Crazy, Stupid, Love":                 "/bkwRSLDEm2VEFZB3HqWWxULCwrE.jpg",
  "All Quiet on the Western Front":      "/hgMJCKxHFMkAIxZiBdSa7bITZVP.jpg",
  "Past Lives":                          "/k3waqVXSnQPOBHfAjZfkXSpXBvf.jpg",
  "Challengers":                         "/H6vke96LDvy6lVg3F8nmS40Tyhb.jpg",
  "Poor Things":                         "/kCGlIMHnOm8JPXSzeIGmAGCR8dl.jpg",
  "Avatar":                              "/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
  "Superman (1978)":                     "/trouwe4G5FinAj7s6JM7PBWKyDc.jpg",
  "The Truman Show":                     "/vuza0WqY239yBXOadKlGwJsZJFE.jpg",
  "Whiplash":                            "/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
  "The Grand Budapest Hotel":            "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
  "No Country for Old Men":              "/6LdCEDFPWDIuEj373vregSygQhR.jpg",
  "There Will Be Blood":                 "/fa0RDkAlCec0STeMNAhPaF89q6U.jpg",
  "Blade Runner 2049":                   "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
  "Her":                                 "/sPjzFFOtEpLkxjqIbqBXnJo2xtO.jpg",
  "The Revenant":                        "/ji3ecJphATlVgV8yqxNkPDDlCZ4.jpg",
  "1917":                                "/iZf0KyrE25z1sage4SYFLCCrMi9.jpg",
  "Dunkirk":                             "/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg",
  "A Beautiful Mind":                    "/bhFccV7KkCd8OBBCFHLaTjB86Nt.jpg",
  "The Prestige":                        "/5MXyQfz8xUP3dIFPTubhTsbFY6N.jpg",
  "Catch Me If You Can":                 "/9o2nucamcrAfOHOdRcb3m0x3A2V.jpg",
  "Knives Out":                          "/pThyQovXQrws2hmMovgaU8Tl5TF.jpg",
  "Once Upon a Time in Hollywood":       "/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg",
  "The Irishman":                        "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
};

const MOVIES = [
  { title: "The Shawshank Redemption",       year: 1994, genre: "Drama",                  rating: 5, note: "The ending still lands. Every single time." },
  { title: "The Godfather",                  year: 1972, genre: "Crime / Drama",           rating: 5, note: "Perfect. The only word that applies." },
  { title: "The Dark Knight",                year: 2008, genre: "Action / Thriller",       rating: 5, note: "Ledger's Joker is the ceiling. Nothing comes close." },
  { title: "The Godfather Part II",          year: 1974, genre: "Crime / Drama",           rating: 5, note: "Rare case where the sequel matches the original." },
  { title: "12 Angry Men",                   year: 1957, genre: "Drama / Thriller",        rating: 5, note: "One room. Twelve people. Still riveting." },
  { title: "Schindler's List",               year: 1993, genre: "Historical Drama",        rating: 5, note: "Devastating. Watch it once. Remember it forever." },
  { title: "The Lord of the Rings: ROTK",    year: 2003, genre: "Fantasy / Epic",          rating: 5, note: "The best ending of a trilogy. The multiple endings are earned." },
  { title: "Pulp Fiction",                   year: 1994, genre: "Crime / Drama",           rating: 5, note: "Changed what movies could be structurally." },
  { title: "Inception",                      year: 2010, genre: "Sci-Fi / Thriller",       rating: 5, note: "The spinning top. Still arguing about it." },
  { title: "The Matrix",                     year: 1999, genre: "Sci-Fi / Action",         rating: 5, note: "Changed cinema. Still holds up completely." },
  { title: "Goodfellas",                     year: 1990, genre: "Crime / Drama",           rating: 5, note: "The most fun three hours of crime cinema." },
  { title: "Interstellar",                   year: 2014, genre: "Sci-Fi / Drama",          rating: 5, note: "The docking scene. The time dilation. Hans Zimmer." },
  { title: "The Silence of the Lambs",       year: 1991, genre: "Thriller / Horror",       rating: 5, note: "Hopkins has 16 minutes of screen time. All of it haunting." },
  { title: "The Departed",                   year: 2006, genre: "Crime / Thriller",        rating: 5, note: "Scorsese at his sharpest. The ending still shocks." },
  { title: "Saving Private Ryan",            year: 1998, genre: "War / Drama",             rating: 5, note: "The first 30 minutes are the most intense cinema I've seen." },
  { title: "Forrest Gump",                   year: 1994, genre: "Drama",                   rating: 5, note: "Life is like a box of chocolates. Somehow never gets old." },
  { title: "Good Will Hunting",              year: 1997, genre: "Drama",                   rating: 5, note: "It's not your fault. Still wrecks me at 30." },
  { title: "Fight Club",                     year: 1999, genre: "Drama / Thriller",        rating: 5, note: "The twist recontextualises everything. First viewing is special." },
  { title: "Spirited Away",                  year: 2001, genre: "Animation / Fantasy",     rating: 5, note: "The greatest animated film ever made. Not a debate." },
  { title: "The Wolf of Wall Street",        year: 2013, genre: "Biography / Drama",       rating: 4, note: "Three hours that feel like ninety minutes." },
  { title: "Parasite",                       year: 2019, genre: "Thriller / Dark Comedy",  rating: 5, note: "The staircase scene. The basement reveal. Bong Joon-ho." },
  { title: "Drive",                          year: 2011, genre: "Crime / Drama",           rating: 5, note: "Almost no dialogue. Pure atmosphere. Gosling at his best." },
  { title: "La La Land",                     year: 2016, genre: "Musical / Romance",       rating: 5, note: "The ending broke something in me. I haven't fixed it." },
  { title: "Spider-Man: Into the Spider-Verse", year: 2018, genre: "Animation / Superhero", rating: 5, note: "Rewrote what animation could be. Still the best Spider-Man." },
  { title: "Avengers: Infinity War",         year: 2018, genre: "Superhero / Epic",        rating: 5, note: "That ending hit different the first time. First time only." },
  { title: "Captain America: Civil War",     year: 2016, genre: "Superhero / Drama",       rating: 4, note: "The airport scene. You know the one." },
  { title: "Crazy, Stupid, Love",            year: 2011, genre: "Romantic Comedy",         rating: 4, note: "The reveal scene is one of the funniest in modern comedy." },
  { title: "All Quiet on the Western Front", year: 2022, genre: "War / Drama",             rating: 5, note: "Devastating. The last 20 minutes destroyed me." },
  { title: "Past Lives",                     year: 2023, genre: "Romance / Drama",         rating: 5, note: "A quiet masterpiece about paths not taken." },
  { title: "Challengers",                    year: 2024, genre: "Drama / Sports",          rating: 5, note: "Tennis has never looked this good. Or this complicated." },
  { title: "Poor Things",                    year: 2023, genre: "Fantasy / Dark Comedy",   rating: 4, note: "Completely singular. Emma Stone is phenomenal." },
  { title: "Avatar",                         year: 2009, genre: "Sci-Fi / Epic",           rating: 3, note: "The world-building is incredible. The script is... there." },
  { title: "Superman (1978)",                year: 1978, genre: "Superhero",               rating: 4, note: "Christopher Reeve made you believe. Still does." },
  { title: "The Truman Show",                year: 1998, genre: "Drama / Sci-Fi",          rating: 5, note: "Gets more unsettling every time I watch it." },
  { title: "Whiplash",                       year: 2014, genre: "Drama / Music",           rating: 5, note: "Tense from the first frame to the last. Fletcher is terrifying." },
  { title: "The Grand Budapest Hotel",       year: 2014, genre: "Comedy / Drama",          rating: 5, note: "Wes Anderson at his most Wes Anderson. Perfect." },
  { title: "No Country for Old Men",         year: 2007, genre: "Thriller / Neo-Western",  rating: 5, note: "Anton Chigurh is the best screen villain since Hannibal." },
  { title: "There Will Be Blood",            year: 2007, genre: "Drama / Epic",            rating: 5, note: "Day-Lewis doing what no one else can do." },
  { title: "Blade Runner 2049",              year: 2017, genre: "Sci-Fi / Drama",          rating: 5, note: "Should not have worked. Is somehow a masterpiece." },
  { title: "Her",                            year: 2013, genre: "Sci-Fi / Romance",        rating: 5, note: "Sad and beautiful and more relevant every year." },
  { title: "The Revenant",                   year: 2015, genre: "Adventure / Drama",       rating: 4, note: "Brutal. Gorgeous. DiCaprio deserved the Oscar." },
  { title: "1917",                           year: 2019, genre: "War / Drama",             rating: 5, note: "The one-take conceit isn't a gimmick — it changes everything." },
  { title: "Dunkirk",                        year: 2017, genre: "War / Thriller",          rating: 5, note: "Non-linear war. Experience over narrative. It works." },
  { title: "A Beautiful Mind",              year: 2001, genre: "Biography / Drama",       rating: 4, note: "Crowe's best performance. The reveal still lands." },
  { title: "The Prestige",                   year: 2006, genre: "Mystery / Thriller",      rating: 5, note: "Nolan's most rewatchable. Every scene means two things." },
  { title: "Catch Me If You Can",            year: 2002, genre: "Biography / Crime",       rating: 4, note: "DiCaprio and Hanks. Pure watchable." },
  { title: "Knives Out",                     year: 2019, genre: "Mystery / Comedy",        rating: 4, note: "The best whodunit in decades. Daniel Craig having a blast." },
  { title: "Once Upon a Time in Hollywood",  year: 2019, genre: "Drama / Comedy",          rating: 4, note: "Slow, meandering, and I loved every minute." },
  { title: "The Irishman",                   year: 2019, genre: "Crime / Drama",           rating: 4, note: "Three and a half hours. Scorsese saying goodbye to an era." },
];

const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

function PosterImage({ title }: { title: string }) {
  const [err, setErr] = useState(false);
  const path = POSTERS[title];
  if (!path || err) {
    return (
      <div className="w-12 h-[72px] rounded-lg shrink-0 bg-muted border border-border/50 flex items-center justify-center">
        <span className="font-mono text-[8px] text-muted-foreground/30 text-center px-1 leading-tight">no<br />poster</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`${POSTER_BASE}${path}`} alt={`${title} poster`} width={48} height={72}
      onError={() => setErr(true)}
      className="w-12 h-[72px] rounded-lg shrink-0 object-cover border border-border/40"
      loading="lazy" />
  );
}

export default function MoviesPage() {
  return (
    <div>
      <section className="px-8 md:px-16 pt-24 pb-16 md:pt-32 md:pb-20">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">Movies</p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Films I&apos;ve<br /><em className="text-primary">loved.</em>
          </h1>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            The ones I keep coming back to, or can&apos;t stop thinking about. Drop me a recommendation — I&apos;m always looking.
          </p>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-16">
        <div className="max-w-xl space-y-3">
          {MOVIES.map((film, i) => (
            <ScrollReveal key={film.title} delay={i * 18}>
              <div className="p-4 border border-border rounded-xl bg-card hover:border-primary/25 transition-colors group flex gap-4 items-start">
                <PosterImage title={film.title} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                      {film.title}
                    </h3>
                    <span className="font-mono text-[11px] text-primary shrink-0">{stars(film.rating)}</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground mb-1.5">{film.year} · {film.genre}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">&ldquo;{film.note}&rdquo;</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
