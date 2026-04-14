import { ImageResponse } from "next/og";

export const alt = "Thien — Tennis Coach in Connecticut";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        backgroundColor: "#f5f0e8",
        fontFamily: "Georgia, serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Tennis balls scattered in background */}
      {[
        { top: 60, right: 120, size: 80 },
        { top: 180, right: 280, size: 56 },
        { top: 420, right: 80, size: 44 },
        { top: 320, right: 400, size: 36 },
        { top: 80, right: 460, size: 28 },
      ].map((ball, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: ball.top,
            right: ball.right,
            width: ball.size,
            height: ball.size,
            borderRadius: "50%",
            background: "#c8e03c",
            opacity: 0.5,
          }}
        />
      ))}

      {/* Label */}
      <div
        style={{
          fontSize: 14,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#7a7060",
          marginBottom: 32,
          fontFamily: "monospace",
        }}
      >
        Tennis Coach &middot; Connecticut
      </div>

      {/* Name */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <span
          style={{
            fontSize: 96,
            fontWeight: 300,
            lineHeight: 0.95,
            color: "#1f1a14",
          }}
        >
          Hey, I&apos;m
        </span>
        <span
          style={{
            fontSize: 96,
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: 0.95,
            color: "#c89520",
          }}
        >
          Thien.
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 22,
          color: "#7a7060",
          marginTop: 32,
          maxWidth: 480,
          lineHeight: 1.5,
        }}
      >
        RPSA certified tennis coach based in Connecticut.
      </div>

      {/* URL */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 80,
          fontSize: 16,
          letterSpacing: "0.15em",
          color: "#a09888",
          fontFamily: "monospace",
        }}
      >
        thien.me
      </div>
    </div>,
    { ...size }
  );
}
