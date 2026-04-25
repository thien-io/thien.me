import Link from "next/link";
import { BauhausIcon, type BauhausIconKind } from "@/components/bauhaus-icon";

const NAV_LINKS = [
  { href: "/",           label: "home"        },
  { href: "/about",      label: "about"       },
  { href: "/testimonial", label: "testimonial" },
  { href: "/booking",    label: "bookings"    },
  { href: "/pricing",    label: "pricing"     },
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

        {/* Bottom row: site name + year | Bauhaus glyphs */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border text-muted-foreground">
          <span className="font-mono text-[11px] uppercase tracking-widest flex items-center gap-3" suppressHydrationWarning>
            <span>thien.me</span>
            <span>© {new Date().getFullYear()}</span>
          </span>
          <span className="flex items-center gap-2" aria-hidden="true">
            {(["redTriangle", "blueSquare", "yellowCircle", "greenSquare", "purpleCircle"] as BauhausIconKind[]).map((kind) => (
              <BauhausIcon key={kind} kind={kind} size={10} />
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
