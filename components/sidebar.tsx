"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home, BookOpen, Users, Menu, X, Moon, Sun, Mail,
  Music, Film, Library, PenLine, ChevronDown, Gamepad2,
} from "lucide-react";
import { useTheme } from "next-themes";

function TennisBallIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M6.3 5.5 C4 8 4 16 6.3 18.5" />
      <path d="M17.7 5.5 C20 8 20 16 17.7 18.5" />
    </svg>
  );
}

const mainLinks = [
  { href: "/",          label: "Home",      icon: Home,     custom: false },
  { href: "/coaching",  label: "Coaching",  icon: null,     custom: true  },
  { href: "/about",     label: "About",     icon: BookOpen, custom: false },
  { href: "/guestbook", label: "Guestbook", icon: Users,    custom: false },
  { href: "/blog",      label: "Blog",      icon: PenLine,  custom: false },
];

const lifeLinks = [
  { href: "/music",  label: "Music",  icon: Music   },
  { href: "/movies", label: "Movies", icon: Film    },
  { href: "/books",  label: "Books",  icon: Library },
];

const gameLinks = [
  { href: "/game", label: "Brick Breaker", icon: Gamepad2 },
  { href: "/pong", label: "Pong",          icon: Gamepad2 },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all w-8 h-8 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="h-4 w-4 transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100 absolute" />
    </button>
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
        <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] flex-1">{label}</span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="space-y-0.5 mt-0.5">{children}</div>}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lifeOpen, setLifeOpen]   = useState(true);
  const [gamesOpen, setGamesOpen] = useState(true);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const NavContent = () => (
    <div className="flex flex-col h-full py-7 px-4">
      {/* Logo */}
      <div className="mb-10 px-2">
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <p className="font-display text-xl font-light text-foreground tracking-wide">
            thien<span className="text-primary italic">.me</span>
          </p>
          <p className="font-mono text-[9px] text-muted-foreground mt-1 tracking-[0.2em] uppercase">
            Tennis Coach · CT
          </p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {mainLinks.map(({ href, label, icon: Icon, custom }) => (
          <Link key={href} href={href} onClick={() => setMobileOpen(false)}
            className={`sidebar-link ${isActive(href) ? "active" : ""}`}>
            {custom
              ? <TennisBallIcon className="h-3.5 w-3.5 shrink-0" />
              : Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
            <span className="text-[13px]">{label}</span>
          </Link>
        ))}

        {/* Life section */}
        <CollapsibleSection label="Life" open={lifeOpen} onToggle={() => setLifeOpen(o => !o)}>
          {lifeLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`sidebar-link ${isActive(href) ? "active" : ""}`}>
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[13px]">{label}</span>
            </Link>
          ))}
        </CollapsibleSection>

        {/* Games section */}
        <CollapsibleSection label="Games" open={gamesOpen} onToggle={() => setGamesOpen(o => !o)}>
          {gameLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`sidebar-link ${isActive(href) ? "active" : ""}`}>
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[13px]">{label}</span>
            </Link>
          ))}
        </CollapsibleSection>
      </nav>

      {/* Footer */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex items-center justify-between px-1">
          <a href="mailto:hello@thien.me" aria-label="Email"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
            <Mail className="h-3.5 w-3.5" />
          </a>
          <ThemeToggle />
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
            thien<span className="text-primary italic">.me</span>
          </p>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
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
