"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";

/** Inline Cal.com calendar, themed to the site, with a bouncing-ball loader until it is ready. */
export function CalEmbed({
  calLink,
  namespace,
  onBooked,
}: {
  calLink: string;
  namespace: string;
  onBooked?: () => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    (async () => {
      const cal = await getCalApi({ namespace });
      if (cancelled) return;
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: {
          light: { "cal-brand": "#3f5a2a", "cal-brand-emphasis": "#34491f" },
          dark: { "cal-brand": "#d7e34a" },
        },
      });
      cal("on", { action: "linkReady", callback: () => !cancelled && setReady(true) });
      cal("on", { action: "bookingSuccessful", callback: () => onBooked?.() });
    })();
    // Cal does not always report linkReady; never leave the loader up for good.
    const fallback = setTimeout(() => !cancelled && setReady(true), 6000);
    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, [namespace, onBooked]);

  return (
    <div className="relative h-full min-h-[560px]">
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-5 transition-opacity duration-500 ${
          ready ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden={ready}
      >
        <BallLoader />
        <p className="t-small text-soft">Loading open times…</p>
      </div>
      <Cal
        namespace={namespace}
        calLink={calLink}
        className={`h-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        style={{ width: "100%", height: "100%", minHeight: 560, overflow: "auto" }}
        config={{ layout: "month_view", theme: "light" }}
      />
    </div>
  );
}

export function BallLoader() {
  return (
    <div className="relative h-16 w-10" role="presentation">
      <span className="ball-bounce absolute bottom-2 left-1/2 -ml-[14px] block h-7 w-7 rounded-full bg-ball" />
      <span className="ball-shadow absolute bottom-0 left-1/2 -ml-[14px] block h-[6px] w-7 rounded-[50%] bg-ink/30" />
    </div>
  );
}
