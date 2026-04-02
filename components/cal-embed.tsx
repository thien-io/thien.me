"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export function CalEmbed({ calLink }: { calLink: string }) {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: resolvedTheme === "dark" ? "dark" : "light",
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, [resolvedTheme]);

  return (
    <Cal
      calLink={calLink}
      style={{ width: "100%", height: "100%", minHeight: "600px", overflow: "scroll" }}
      config={{ layout: "month_view" }}
    />
  );
}
