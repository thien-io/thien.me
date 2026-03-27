"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Dumbbell,
  BookOpen,
  Users,
  Menu,
  X,
  Moon,
  Sun,
  Mail,
  Github,
  Twitter,
} from "lucide-react";
import { useTheme } from "next-themes";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/coaching", label: "Coaching", icon: Dumbbell },
  { href: "/about", label: "About", icon: BookOpen },
  { href: "/guestbook", label: "Guestbook", icon: Users },
];

const socialLinks = [
  { href: "mailto:hello@thien.me", label: "Email", icon: Mail },
  { href: "https://twitter.com/thienme", label: "Twitter", icon: Twitter },
  { href: "https://github.com/thienme", label: "GitHub", icon: Github },
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

  const NavContent = () => (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Logo */}
      <div className="mb-8 px-3">
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <p className="font-display text-xl font-light text-foreground">
            thien<span className="text-primary">.me</span>
          </p>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5 tracking-widest uppercase">
            Tennis Coach
          </p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-3 mb-2">
          Navigate
        </p>
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`sidebar-link ${pathname === href ? "active" : ""}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex gap-1">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col border-r border-border bg-background/80 backdrop-blur-sm z-40">
        <NavContent />
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-background/90 backdrop-blur-sm border-b border-border">
        <Link href="/">
          <p className="font-display text-lg font-light">
            thien<span className="text-primary">.me</span>
          </p>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 top-14">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-background border-r border-border w-64 h-full shadow-lg">
            <NavContent />
          </div>
        </div>
      )}

      {/* Mobile top padding */}
      <div className="md:hidden h-14" />
    </>
  );
}
