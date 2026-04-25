export type BauhausIconKind =
  | "redTriangle"
  | "redCircle"
  | "blueH"
  | "blueSquare"
  | "yellowCircle"
  | "greenE"
  | "greenSquare"
  | "purpleN"
  | "purpleCircle";

const COLORS = {
  red: "#f24e1e",
  blue: "#06b6d4",
  yellow: "#ffcd1a",
  green: "#22C55E",
  purple: "#a259ff",
};

export function BauhausIcon({
  kind,
  size = 20,
  muted = false,
  className,
}: {
  kind: BauhausIconKind;
  size?: number;
  muted?: boolean;
  className?: string;
}) {
  const color = muted ? "currentColor" : colorFor(kind);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      shapeRendering="geometricPrecision"
      className={className}
      aria-hidden="true"
      style={{ flexShrink: 0, display: "block", color: muted ? "currentColor" : undefined }}
    >
      {shapeFor(kind, color)}
    </svg>
  );
}

function colorFor(kind: BauhausIconKind): string {
  switch (kind) {
    case "redTriangle":
    case "redCircle":
      return COLORS.red;
    case "blueH":
    case "blueSquare":
      return COLORS.blue;
    case "yellowCircle":
      return COLORS.yellow;
    case "greenE":
    case "greenSquare":
      return COLORS.green;
    case "purpleN":
    case "purpleCircle":
      return COLORS.purple;
  }
}

function shapeFor(kind: BauhausIconKind, c: string): React.ReactNode {
  switch (kind) {
    case "redTriangle":
      return <polygon points="50,10 90,90 10,90" fill={c} />;
    case "redCircle":
    case "yellowCircle":
      return <circle cx="50" cy="50" r="40" fill={c} />;
    case "blueH":
      return (
        <g fill={c}>
          <rect x="14" y="10" width="22" height="80" />
          <rect x="64" y="10" width="22" height="80" />
        </g>
      );
    case "blueSquare":
      return <rect x="10" y="10" width="80" height="80" fill={c} />;
    case "greenE":
      return (
        <g fill={c}>
          <rect x="10" y="10" width="80" height="22" />
          <rect x="10" y="68" width="80" height="22" />
        </g>
      );
    case "greenSquare":
      return <rect x="10" y="10" width="80" height="80" fill={c} />;
    case "purpleN":
      return (
        <path
          d="M 10 90 L 10 50 A 40 40 0 0 1 90 50 L 90 90 L 70 90 L 70 50 A 20 20 0 0 0 30 50 L 30 90 Z"
          fill={c}
        />
      );
    case "purpleCircle":
      return <circle cx="50" cy="50" r="40" fill={c} />;
  }
}
