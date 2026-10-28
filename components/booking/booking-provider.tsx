"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { BookingDialog } from "@/components/booking/booking-dialog";
import { courtById, OPEN_COURTS, type CourtId } from "@/lib/site";

interface BookingState {
  open: (court?: CourtId) => void;
  close: () => void;
  notify: (message: string) => void;
}

const BookingContext = createContext<BookingState | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [court, setCourt] = useState<CourtId>(OPEN_COURTS[0].id);
  const [toast, setToast] = useState<string | null>(null);

  const open = useCallback((id?: CourtId) => {
    if (id) setCourt(id);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const notify = useCallback((message: string) => setToast(message), []);

  // Old booking links redirect to /?book=<court>; open the dialog on arrival.
  useEffect(() => {
    const url = new URL(window.location.href);
    const book = url.searchParams.get("book");
    if (book === null) return;
    const match = courtById(book);
    open(match?.id);
    url.searchParams.delete("book");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5200);
    return () => clearTimeout(t);
  }, [toast]);

  const onBooked = useCallback(() => {
    setToast("Booked. I'll text you to confirm.");
  }, []);

  const value = useMemo(() => ({ open, close, notify }), [open, close, notify]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        court={court}
        onCourtChange={setCourt}
        onBooked={onBooked}
      />
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[120] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink py-3 pl-3 pr-5 text-paper shadow-[0_18px_48px_-12px_rgba(20,22,16,0.45)]"
              role="status"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ball text-ink">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="t-small">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BookingContext.Provider>
  );
}
