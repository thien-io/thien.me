import Link from "next/link";
import Image from "next/image";
import logo from "../app/icon.png";

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
              className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
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
            <Image src={logo} alt="" width={22} height={22} className="h-[22px] w-auto opacity-70" />
          </span>
        </div>
      </div>
    </footer>
  );
}
