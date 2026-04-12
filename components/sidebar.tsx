"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home, BookOpen, Users, Menu, X, Mail,
  Music, Film, ChevronDown, CalendarCheck,
  Trophy, CircleDollarSign,
} from "lucide-react";

// Tennis ball icon — provided by user
function TennisBallIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path fill="currentColor" d="M201.57 54.46a104 104 0 1 0 0 147.08a103.4 103.4 0 0 0 0-147.08M65.75 65.77a87.63 87.63 0 0 1 53.66-25.31A87.3 87.3 0 0 1 94 94.06a87.42 87.42 0 0 1-53.62 25.35a87.58 87.58 0 0 1 25.37-53.64m-25.42 69.71a103.3 103.3 0 0 0 65-30.11a103.24 103.24 0 0 0 30.13-65a87.78 87.78 0 0 1 80.18 80.14a104 104 0 0 0-95.16 95.1a87.78 87.78 0 0 1-80.18-80.14Zm149.92 54.75a87.7 87.7 0 0 1-53.66 25.31a88 88 0 0 1 79-78.95a87.58 87.58 0 0 1-25.34 53.64"/>
    </svg>
  );
}

const mainLinks = [
  { href: "/",          label: "Home",      icon: Home,     custom: false },
  { href: "/about",     label: "About",     icon: BookOpen, custom: false },
  { href: "/testimonial", label: "Testimonial", icon: Users,    custom: false },

];

const lifeLinks = [
  { href: '/music', label: 'Music', icon: Music },
  { href: '/movies', label: 'Movies', icon: Film },
];


const coachingLinks = [
  {
    href: '/booking',
    label: 'Bookings',
    icon: CalendarCheck,
    custom: false,
    pickleIcon: false,
  },
  {
    href: '/pricing',
    label: 'Pricing',
    icon: CircleDollarSign,
    custom: false,
    pickleIcon: false,
  },
  {
    href: '/ladder',
    label: 'Ladder',
    icon: Trophy,
    custom: false,
    pickleIcon: false,
  },
];

function PickleballIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <path fill="currentColor" d="M7.017 14.764q.495.513 1.127.757t1.297.244q.701 0 1.373-.273q.67-.273 1.223-.825l.669-.669q.533-.533.806-1.204t.273-1.373q0-.663-.254-1.293t-.748-1.144L9.175 5.359q-.423-.396-1.005-.396t-.978.415L3.416 9.16Q3 9.575 3 10.158t.416.998zM18.267 21l-5.586-5.606q-.687.689-1.549 1.017q-.862.33-1.736.33q-.851 0-1.65-.318q-.798-.317-1.437-.952L2.702 11.85q-.348-.348-.525-.79Q2 10.62 2 10.167q0-.457.177-.905t.525-.816l3.783-3.802q.348-.348.79-.525q.441-.177.892-.177q.458 0 .906.177t.816.545L13.47 8.27q.635.639.952 1.437q.318.798.318 1.65q0 .88-.342 1.749q-.341.868-1.01 1.574l5.592 5.611zm.864-12.23q-1.197 0-2.029-.846q-.833-.847-.833-2.043t.833-2.039T19.131 3t2.043.846t.845 2.042t-.845 2.039t-2.043.842m.005-1q.778 0 1.33-.548q.553-.549.553-1.332t-.548-1.336T19.139 4t-1.326.548q-.544.549-.544 1.332q0 .784.545 1.336q.544.553 1.322.553M8.323 10.285"/>
    </svg>
  );
}


function CollapsibleSection({
  label, open, onToggle, children,
}: {
  label: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="pt-3">
      <button onClick={onToggle} className="flex items-center gap-2 px-3 py-1.5 w-full text-left">
        <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.2em] flex-1">{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="space-y-0.5 mt-0.5">{children}</div>}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lifeOpen, setLifeOpen]       = useState(false);
const [coachingOpen, setCoachingOpen] = useState(true);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const NavContent = () => (
    <div className="flex flex-col h-full py-7 px-4">
      {/* Logo */}
      <div className="mb-10 px-2">
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <p className="font-display text-2xl font-light text-foreground tracking-wide">
            <span className="text-primary">thien</span><span className="text-foreground italic">.me</span>
          </p>
          <p className="font-mono text-[10px] text-muted-foreground mt-1 tracking-[0.2em] uppercase">
            Coach · CT
          </p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {mainLinks.map(({ href, label, icon: Icon, custom }) => (
          <Link key={href} href={href} onClick={() => setMobileOpen(false)}
            className={`sidebar-link ${isActive(href) ? "active" : ""}`}>
            {custom
              ? <TennisBallIcon className="h-4 w-4 shrink-0" />
              : Icon && <Icon className="h-4 w-4 shrink-0" />}
            <span>{label}</span>
          </Link>
        ))}

        {/* Coaching section */}
        <CollapsibleSection label="Coaching" open={coachingOpen} onToggle={() => setCoachingOpen(o => !o)}>
          {coachingLinks.map(({ href, label, icon: Icon, custom, pickleIcon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`sidebar-link ${isActive(href) ? "active" : ""}`}>
              {pickleIcon
                ? <PickleballIcon className="h-4 w-4 shrink-0" />
                : custom
                  ? <TennisBallIcon className="h-4 w-4 shrink-0" />
                  : Icon
                    ? <Icon className="h-4 w-4 shrink-0" />
                    : <span className="h-4 w-4 shrink-0" />}
              <span>{label}</span>
            </Link>
          ))}
        </CollapsibleSection>
      </nav>

      {/* Footer */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="px-1">
          <a href="mailto:hello@thien.me" aria-label="Email"
            className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all inline-flex">
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 flex-col border-r border-border bg-background/80 backdrop-blur-md z-40">
        <NavContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-14 bg-background/90 backdrop-blur-md border-b border-border">
        <Link href="/">
          <p className="font-display text-lg font-light">
            <span className="text-primary">thien</span><span className="text-foreground italic">.me</span>
          </p>
        </Link>
        <div className="flex items-center gap-1">
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 top-14">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-background border-r border-border w-56 h-full shadow-2xl">
            <NavContent />
          </div>
        </div>
      )}

      <div className="md:hidden h-14" />
    </>
  );
}
