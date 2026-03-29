import { ScrollReveal } from "@/components/scroll-reveal";

const movies = [
  { title: "All Quiet on the Western Front", year: 2022, genre: "War / Drama",          rating: 5, note: "Devastating. The last 20 minutes destroyed me." },
  { title: "Past Lives",                      year: 2023, genre: "Romance / Drama",       rating: 5, note: "A quiet masterpiece about paths not taken." },
  { title: "The Banshees of Inisherin",       year: 2022, genre: "Drama / Dark Comedy",   rating: 5, note: "Colin Farrell career best. Friendship is complicated." },
  { title: "Aftersun",                        year: 2022, genre: "Drama",                 rating: 5, note: "Wrecked me. Watch it twice." },
  { title: "Tár",                             year: 2022, genre: "Drama / Thriller",      rating: 5, note: "Cate Blanchett is operating on another level." },
  { title: "Dune: Part Two",                  year: 2024, genre: "Sci-Fi / Epic",         rating: 4, note: "Cinema for cinema's sake. Go big screen." },
  { title: "Challengers",                     year: 2024, genre: "Drama / Sports",        rating: 5, note: "Tennis has never looked this good. Or this complicated." },
  { title: "Oppenheimer",                     year: 2023, genre: "Historical / Drama",    rating: 4, note: "Three hours. Worth every minute." },
  { title: "The Holdovers",                   year: 2023, genre: "Comedy / Drama",        rating: 4, note: "A warm, perfectly acted holiday film." },
  { title: "Bottoms",                         year: 2023, genre: "Comedy",                rating: 4, note: "Genuinely unhinged. I loved it." },
  { title: "A Haunting in Venice",            year: 2023, genre: "Mystery / Thriller",    rating: 3, note: "Best of the Branagh Poirots." },
  { title: "Poor Things",                     year: 2023, genre: "Fantasy / Dark Comedy", rating: 4, note: "Completely singular. Emma Stone is phenomenal." },
];

const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

export default function MoviesPage() {
  return (
    <div>
      <section className="px-8 md:px-16 pt-24 pb-16 md:pt-32 md:pb-20">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">Movies</p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Films I've<br /><em className="text-primary">loved.</em>
          </h1>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Recent watches with short notes. No spoilers — just honest reactions.
          </p>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-16">
        <div className="max-w-xl space-y-4">
          {movies.map((film, i) => (
            <ScrollReveal key={film.title} delay={i * 45}>
              <div className="p-6 border border-border rounded-md bg-card hover:border-primary/25 transition-colors group">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {film.title}
                    </h3>
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                      {film.year} · {film.genre}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-primary shrink-0 tracking-wider">
                    {stars(film.rating)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  "{film.note}"
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
