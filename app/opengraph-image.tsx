import { ImageResponse } from "next/og";

export const alt = "Thien — RSPA certified tennis & pickleball coach";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#f5f0e8";
const INK = "#1f1a14";
const MUTED = "#7a7060";
const FAINT = "#a09888";
const GOLD = "#c89520";
const BALL = "#c8e03c";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: BG,
          fontFamily: "Georgia, serif",
          color: INK,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative tennis balls */}
        {[
          { top: 60, right: 110, size: 92 },
          { top: 180, right: 270, size: 52 },
          { top: 430, right: 90, size: 60 },
          { top: 90, right: 440, size: 30 },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: b.top,
              right: b.right,
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: BALL,
              opacity: 0.45,
            }}
          />
        ))}

        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 40, fontWeight: 300, color: MUTED }}>
            Hey, I&apos;m
          </span>
          <span
            style={{
              fontSize: 132,
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1,
              color: GOLD,
            }}
          >
            Thien.
          </span>
        </div>

        {/* Role */}
        <div
          style={{
            fontSize: 30,
            color: MUTED,
            marginTop: 32,
            maxWidth: 620,
            lineHeight: 1.45,
          }}
        >
          {"RSPA certified tennis & pickleball coach."}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 80,
            fontFamily: "monospace",
            fontSize: 16,
            letterSpacing: "0.15em",
            color: GOLD,
          }}
        >
          thien.me
        </div>
      </div>
    ),
    { ...size }
  );
}
