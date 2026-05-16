import Link from "next/link";

function PetalMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 680 680"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <g transform="translate(340,340)" fill="currentColor">
        <g transform="translate(0,-30)">
          <path d="M 0,0 C -92,-34 -86,-135 0,-182 C 86,-135 92,-34 0,0" />
        </g>
        <g transform="rotate(90) translate(0,-30)">
          <path d="M 0,0 C -92,-34 -86,-135 0,-182 C 86,-135 92,-34 0,0" />
        </g>
        <g transform="rotate(180) translate(0,-30)">
          <path d="M 0,0 C -92,-34 -86,-135 0,-182 C 86,-135 92,-34 0,0" />
        </g>
        <g transform="rotate(270) translate(0,-30)">
          <path d="M 0,0 C -92,-34 -86,-135 0,-182 C 86,-135 92,-34 0,0" />
        </g>
      </g>
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/",        label: "home"     },
  { href: "/about",   label: "about"    },
  { href: "/booking", label: "bookings" },
  { href: "/pricing", label: "pricing"  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="w-full max-w-5xl mx-auto px-8 md:px-16 pt-16 sm:pt-20 pb-20 flex flex-col gap-9">
        {/* Top row: big wordmark + nav links */}
        <div className="flex flex-wrap items-baseline justify-between gap-5">
          <Link
            href="/"
            className="font-display font-light tracking-[-0.02em] leading-none text-foreground"
            style={{ fontSize: "clamp(44px, 6vw, 84px)" }}
            aria-label="Thien — home"
          >
            <span className="text-primary">thien</span><span className="text-foreground italic">.me</span>
          </Link>
          <nav className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom row: site name + year | petal mark */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border text-muted-foreground">
          <span className="font-mono text-[11px] uppercase tracking-widest flex items-center gap-3" suppressHydrationWarning>
            <span>thien.me</span>
            <span>© {new Date().getFullYear()}</span>
          </span>
          <span className="text-primary" aria-hidden="true">
            <PetalMark size={18} />
          </span>
        </div>
      </div>
    </footer>
  );
}
