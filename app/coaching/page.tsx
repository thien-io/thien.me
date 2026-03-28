export default function CoachingPage() {
  const packages = [
    {
      name: 'Single Session',
      price: '$100',
      duration: '60 min',
      description:
        'A focused one-on-one session — great for trying things out or working on a specific part of your game.',
      includes: [
        'Technique assessment',
        'Drills and live play',
        'Session notes sent after',
      ],
    },
    {
      name: 'Monthly Package',
      price: '$360',
      duration: '4 sessions / month',
      description:
        'Consistent work builds real improvement. This is how most of my students see the biggest gains.',
      includes: [
        '4 × 60 min sessions',
        'Video analysis',
        'Between-session check-ins',
        'Customized practice plan',
      ],
      featured: true,
    },
    {
      name: 'Intensive',
      price: '$800',
      duration: '10 sessions',
      description:
        'Ideal before a season, tournament, or if you want to fast-track your development over a few weeks.',
      includes: [
        '10 × 60 min sessions',
        'Full video breakdown',
        'Match strategy sessions',
        'Priority scheduling',
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-12 animate-fade-in">
        <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-4">
          Coaching
        </p>
        <h1 className="font-display text-5xl font-light mb-4">
          Work with me
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-lg">
          All sessions are held in New York. I keep my roster small so every
          student gets real attention and a tailored approach.
        </p>
      </div>

      {/* Packages */}
      <div className="space-y-4 mb-16">
        {packages.map((pkg, i) => (
          <div
            key={pkg.name}
            className={`relative p-6 rounded-xl border transition-all duration-200 hover:shadow-sm opacity-0 animate-fade-in ${
              pkg.featured
                ? "border-primary/40 bg-accent/50"
                : "border-border bg-card"
            }`}
            style={{ animationDelay: `${i * 100 + 100}ms` }}
          >
            {pkg.featured && (
              <span className="absolute -top-2.5 left-5 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-wider">
                Most popular
              </span>
            )}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-foreground">{pkg.name}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {pkg.duration}
                </p>
              </div>
              <span className="font-display text-2xl font-light text-primary">
                {pkg.price}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {pkg.description}
            </p>
            <ul className="space-y-1.5">
              {pkg.includes.map((item) => (
                <li
                  key={item}
                  className="text-xs text-muted-foreground flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className="p-8 rounded-xl border border-border text-center opacity-0 animate-fade-in"
        style={{ animationDelay: "500ms" }}
      >
        <h2 className="font-display text-2xl font-light mb-2">
          Ready to get started?
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Send me a message and we'll find a time that works.
        </p>
        <a
          href="mailto:hello@thien.me"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Email me
        </a>
      </div>
    </div>
  );
}
