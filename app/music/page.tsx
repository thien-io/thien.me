import { ScrollReveal } from "@/components/scroll-reveal";
import { SpotifyWidget } from "@/components/spotify-widget";

const topSongs = [
  { rank: 1,  title: "Espresso",                              artist: "Sabrina Carpenter",             duration: "2:55" },
  { rank: 2,  title: "A Bar Song (Tipsy)",                    artist: "Shaboozey",                     duration: "3:17" },
  { rank: 3,  title: "Birds of a Feather",                    artist: "Billie Eilish",                 duration: "3:30" },
  { rank: 4,  title: "Too Sweet",                             artist: "Hozier",                        duration: "4:02" },
  { rank: 5,  title: "Good Luck, Babe!",                      artist: "Chappell Roan",                 duration: "3:39" },
  { rank: 6,  title: "White Flag",                            artist: "Joseph",                        duration: "3:44" },
  { rank: 7,  title: "Lose Control",                          artist: "Teddy Swims",                   duration: "3:29" },
  { rank: 8,  title: "saturn",                                artist: "SZA",                           duration: "2:37" },
  { rank: 9,  title: "Please Please Please",                  artist: "Sabrina Carpenter",             duration: "2:58" },
  { rank: 10, title: "I Had Some Help",                       artist: "Post Malone ft. Morgan Wallen", duration: "3:06" },
];

const moods = [
  { label: "On-court warmup",      desc: "High BPM, no lyrics to overthink" },
  { label: "Post-match wind down", desc: "Something slow, something honest" },
  { label: "Early morning drive",  desc: "Coffee not optional" },
  { label: "Deep focus",           desc: "Instrumental only — no words" },
];

export default function MusicPage() {
  return (
    <div>
      <section className="px-8 md:px-16 pt-24 pb-16 md:pt-32 md:pb-20">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">Music</p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            What I'm<br /><em className="text-primary">listening to.</em>
          </h1>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            My top 10 tracks this month. The playlist changes — the taste doesn't.
          </p>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-12">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-5">Right now</p>
          <div className="max-w-sm"><SpotifyWidget /></div>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-16">
        <ScrollReveal className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">This month</p>
          <h2 className="font-display text-3xl font-light">Top 10 tracks</h2>
        </ScrollReveal>

        <div className="max-w-xl space-y-px">
          {topSongs.map((song, i) => (
            <ScrollReveal key={song.rank} delay={i * 35}>
              <div className="flex items-center gap-5 py-3.5 border-b border-border/40 group hover:bg-accent/30 -mx-3 px-3 rounded-md transition-colors cursor-default">
                <span className="font-mono text-[11px] text-muted-foreground/60 w-4 text-right shrink-0">
                  {String(song.rank).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {song.title}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{song.artist}</p>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground/60 shrink-0 tabular-nums">
                  {song.duration}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-16">
        <ScrollReveal className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Context</p>
          <h2 className="font-display text-3xl font-light">How I listen</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          {moods.map((m, i) => (
            <ScrollReveal key={m.label} delay={i * 60}>
              <div className="p-5 border border-border rounded-md bg-card hover:border-primary/30 transition-colors">
                <p className="text-sm font-medium text-foreground mb-1">{m.label}</p>
                <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
