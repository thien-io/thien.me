import { SpotifyWidget } from "@/components/spotify-widget";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      {/* Hero */}
      <section className="mb-16 animate-fade-in">
        <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-4">
          Tennis Coach · Connecticut
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6 text-foreground">
          Hi, I'm{" "}
          <span className="italic text-primary">Thien.</span>
        </h1>
        <p className="text-muted-foreground leading-relaxed text-lg max-w-lg">
          I coach tennis with a focus on technique, mental game, and enjoying
          the process. Whether you're picking up a racket for the first time or
          competing at a high level — let's work together.
        </p>
        <div className="flex items-center gap-4 mt-8">
          <a
            href="/coaching"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Work with me
          </a>
          <a
            href="/guestbook"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            Read testimonials
          </a>
        </div>
      </section>

      {/* About snippet */}
      <section className="mb-16 opacity-0 animate-fade-in [animation-delay:150ms]">
        <h2 className="font-display text-2xl font-light mb-4 text-foreground">
          A bit about me
        </h2>
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            I've been playing competitive tennis since I was 8 years old. Over
            the years I've trained under coaches who shaped not just my game,
            but how I think about sport, practice, and improvement.
          </p>
          <p>
            Now I bring that experience to my students — from beginners learning
            to rally consistently to players breaking into tournament play. My
            coaching philosophy: slow down to speed up, build habits before
            tactics, and make every session worthwhile.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16 opacity-0 animate-fade-in [animation-delay:250ms]">
        <div className="grid grid-cols-3 gap-6 py-8 border-y border-border">
          {[
            { value: "8+", label: "Years coaching" },
            { value: "200+", label: "Students trained" },
            { value: "All levels", label: "Beginner to advanced" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-light text-primary">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Spotify */}
      <section className="opacity-0 animate-fade-in [animation-delay:350ms]">
        <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-4">
          Currently playing
        </p>
        <SpotifyWidget />
      </section>
    </div>
  );
}
