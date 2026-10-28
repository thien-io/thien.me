import type { ReactNode } from "react";

/** Rises into view once, driven by the page-wide <Reveals /> observer. */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "none";
}) {
  return (
    <div className={`reveal ${className}`} style={{ ["--d" as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}
