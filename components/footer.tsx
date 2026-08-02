import Link from "next/link";

function PetalMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <g transform="translate(500,500) scale(1.11) translate(-500,-500)" fill="none">
        <path
          d="M 679 321 A 180 180 0 1 0 321 321 A 180 180 0 1 0 321 679 A 180 180 0 1 0 679 679 A 180 180 0 1 0 679 321 Z"
          stroke="currentColor"
          strokeWidth="50"
          strokeLinejoin="round"
        />
        <g fill="currentColor">
          <path d="M 500 290 Q 575 380 500 465 Q 425 380 500 290 Z"/>
          <path d="M 710 500 Q 620 575 535 500 Q 620 425 710 500 Z"/>
          <path d="M 500 710 Q 575 620 500 535 Q 425 620 500 710 Z"/>
          <path d="M 290 500 Q 380 575 465 500 Q 380 425 290 500 Z"/>
          <circle cx="500" cy="500" r="28"/>
        </g>
      </g>
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/",             label: "home"         },
  { href: "/about",        label: "about"        },
  { href: "/testimonials", label: "testimonials" },
  { href: "/booking",      label: "bookings"     },
  { href: "/pricing",      label: "pricing"      },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="w-full max-w-5xl mx-auto px-8 md:px-16 pt-16 sm:pt-20 pb-20 flex flex-col gap-9">
        {/* Top row: nav links */}
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

        {/* Bottom row: site name + year | petal mark */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border text-muted-foreground">
          <span className="font-mono text-[11px] uppercase tracking-widest flex items-center gap-3" suppressHydrationWarning>
            <span>thien.me</span>
            <span>© {new Date().getFullYear()}</span>
          </span>
          <span className="text-muted-foreground" aria-hidden="true">
            <PetalMark size={18} />
          </span>
        </div>
      </div>
    </footer>
  );
}
