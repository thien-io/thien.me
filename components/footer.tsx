import Link from "next/link";

const links = [
  { label: "Home",      href: "/" },
  { label: "About",     href: "/about" },
  { label: "Blog",      href: "/blog" },
  { label: "Guestbook", href: "/guestbook" },
];

const coachingLinks = [
  { label: "Tennis",     href: "/coaching/tennis" },
  { label: "Pickleball", href: "/coaching/pickleball" },
];

const lifeLinks = [
  { label: "Music",  href: "/music" },
  { label: "Movies", href: "/movies" },
  { label: "Books",  href: "/books" },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 md:mt-24">
      <div className="px-8 md:px-16 py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12 max-w-2xl">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display text-xl font-light text-foreground mb-1">
              <span className="text-primary">thien</span><span className="text-foreground italic">.me</span>
            </p>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
              Coach · CT
            </p>
            <div className="mt-4">
              <a href="mailto:hello@thien.me" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                hello@thien.me
              </a>
            </div>
          </div>

          {/* Pages */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Pages</p>
            <ul className="space-y-2">
              {links.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coaching */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Coaching</p>
            <ul className="space-y-2">
              {coachingLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Life */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Life</p>
            <ul className="space-y-2">
              {lifeLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-2xl">
          <p className="font-mono text-[10px] text-muted-foreground/50" suppressHydrationWarning>
            © {new Date().getFullYear()} Thien.
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/40">thien.me</p>
        </div>
      </div>
    </footer>
  );
}
