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
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2.5px solid #c89520",
      }}
    >
      <span
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 20,
          fontWeight: 700,
          color: "#c89520",
          lineHeight: 1,
          marginTop: 1,
        }}
      >
        t
      </span>
    </div>,
    { ...size }
  );
}
