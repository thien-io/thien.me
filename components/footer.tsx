import Link from "next/link";
import { Mail } from "lucide-react";
import { LikeButton } from "@/components/like-button";

function VenmoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.07 2C19.54 2.78 19.75 3.58 19.75 4.6c0 3.17-2.71 7.29-4.91 10.18H9.94L7.76 2.97l4.67-.45 1.12 8.96c1.04-1.7 2.33-4.38 2.33-6.2 0-.99-.17-1.67-.44-2.23L19.07 2z"/>
    </svg>
  );
}

const links = [
  { label: "Home",      href: "/" },
  { label: "About",     href: "/about" },
  { label: "Guestbook", href: "/guestbook" },
];

const coachingLinks = [
  { label: "Bookings", href: "/booking" },
  { label: "Pricing",  href: "/pricing" },
  { label: "Ladder",   href: "/ladder" },
];

const lifeLinks = [
  { label: "Music",  href: "/music" },
  { label: "Movies", href: "/movies" },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 md:mt-24">
      <div className="w-full max-w-5xl mx-auto px-8 md:px-16 py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12 max-w-full">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display text-xl font-light text-foreground mb-1">
              <span className="text-primary">thien</span><span className="text-foreground italic">.me</span>
            </p>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
              Coach · CT
            </p>
            <div className="mt-4 space-y-2">
              <a href="mailto:hello@thien.me" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-3 h-3 shrink-0" />
                hello@thien.me
              </a>
              <a
                href="https://venmo.com/thienmtran"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <VenmoIcon className="w-3 h-3 shrink-0" />
                @thienmtran
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

        <div className="border-t border-border/50 pt-6 flex items-center justify-between max-w-full">
          <p className="font-mono text-[10px] text-muted-foreground/50" suppressHydrationWarning>
            © {new Date().getFullYear()} Thien.
          </p>
          <LikeButton />
        </div>
      </div>
    </footer>
  );
}
