export default function AboutPage() {
  const timeline = [
    { year: "2006", event: "Started playing tennis at age 8" },
    { year: "2012", event: "Competed in regional junior tournaments" },
    { year: "2016", event: "Began coaching part-time during college" },
    { year: "2018", event: "Became a certified USPTA tennis coach" },
    { year: "2020", event: "Started thien.me — full-time coaching" },
    { year: "Now", event: "200+ students, still learning every day" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-12 animate-fade-in">
        <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-4">
          About
        </p>
        <h1 className="font-display text-5xl font-light mb-6">
          The story so far
        </h1>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Tennis found me at 8, and I never really let it go. What started as
            weekend lessons turned into a decade of competitive play, then
            coaching, then a career built entirely around this sport.
          </p>
          <p>
            I'm based in New York and work with players of all ages and skill
            levels. My approach is deliberate — I'd rather help one person
            understand <em>why</em> their forehand breaks down under pressure
            than run 50 drills without context.
          </p>
          <p>
            Off the court, I'm into good coffee, long bike rides, and reading
            about how athletes train mentally. If that sounds like your kind of
            person — let's play.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div
        className="opacity-0 animate-fade-in [animation-delay:150ms]"
      >
        <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-6">
          Timeline
        </p>
        <div className="relative">
          <div className="absolute left-[52px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div key={i} className="flex items-start gap-6">
                <span className="w-[52px] shrink-0 text-right text-xs font-mono text-muted-foreground pt-0.5">
                  {item.year}
                </span>
                <div className="relative flex items-center">
                  <div className="absolute -left-[5px] w-2.5 h-2.5 rounded-full border-2 border-primary bg-background" />
                </div>
                <p className="text-sm text-foreground pl-4">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
