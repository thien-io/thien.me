import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "11px solid #c89520",
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 92,
            fontWeight: 700,
            color: "#c89520",
            lineHeight: 1,
            marginTop: 4,
          }}
        >
          t
        </span>
      </div>
    </div>,
    { ...size }
  );
}
