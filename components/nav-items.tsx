import { Home, BookOpen, Quote, CalendarCheck, CircleDollarSign } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: BookOpen },
  { href: "/testimonials", label: "Testimonials", icon: Quote },
  { href: "/booking", label: "Bookings", icon: CalendarCheck },
  { href: "/pricing", label: "Pricing", icon: CircleDollarSign },
];
