"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home, Dumbbell, BookOpen, Users, Menu, X, Moon, Sun, Mail,
  Music, Film, Library, PenLine, ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";

const mainLinks = [
  { href: "/",          label: "Home",      icon: Home },
  { href: "/coaching",  label: "Coaching",  icon: Dumbbell },
  { href: "/about",     label: "About",     icon: BookOpen },
  { href: "/guestbook", label: "Guestbook", icon: Users },
  { href: "/blog",      label: "Blog",      icon: PenLine },
];

const lifeLinks = [
  { href: "/music",  label: "Music",  icon: Music },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/books",  label: "Books",  icon: Library },
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

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lifeOpen, setLifeOpen] = useState(true);

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

      {/* Main nav */}
      <nav className="flex-1 space-y-0.5">
        {mainLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} onClick={() => setMobileOpen(false)}
            className={`sidebar-link ${isActive(href) ? "active" : ""}`}>
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[13px]">{label}</span>
          </Link>
        ))}

        {/* Life section */}
        <div className="pt-3">
          <button
            onClick={() => setLifeOpen(!lifeOpen)}
            className="flex items-center gap-2 px-3 py-1.5 w-full text-left"
          >
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] flex-1">
              Life
            </span>
            <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${lifeOpen ? "" : "-rotate-90"}`} />
          </button>
          {lifeOpen && (
            <div className="space-y-0.5 mt-0.5">
              {lifeLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  className={`sidebar-link ${isActive(href) ? "active" : ""}`}>
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-[13px]">{label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
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
