"use client";

import { ArrowRight } from "lucide-react";
import { useBooking } from "@/components/booking/booking-provider";
import type { CourtId } from "@/lib/site";

export function BookButton({
  court,
  children = "Book a lesson",
  className = "btn btn-primary",
  arrow = true,
}: {
  court?: CourtId;
  children?: React.ReactNode;
  className?: string;
  arrow?: boolean;
}) {
  const { open } = useBooking();
  return (
    <button type="button" onClick={() => open(court)} className={className} aria-haspopup="dialog">
      {children}
      {arrow && <ArrowRight className="arrow h-4 w-4" aria-hidden />}
    </button>
  );
}
