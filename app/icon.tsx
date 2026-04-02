import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#c8e03c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2.5px solid #a0b82a",
      }}
    >
      <span
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 19,
          fontWeight: 700,
          color: "#1e2a00",
          fontStyle: "italic",
          lineHeight: 1,
          marginTop: 1,
        }}
      >
        T
      </span>
    </div>,
    { ...size }
  );
}
