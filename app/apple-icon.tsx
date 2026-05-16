import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 680 680"
          width={120}
          height={120}
        >
          <g transform="translate(340,340)" fill="#fff">
            <g transform="translate(0,-30)">
              <path d="M 0,0 C -92,-34 -86,-135 0,-182 C 86,-135 92,-34 0,0" />
            </g>
            <g transform="rotate(90) translate(0,-30)">
              <path d="M 0,0 C -92,-34 -86,-135 0,-182 C 86,-135 92,-34 0,0" />
            </g>
            <g transform="rotate(180) translate(0,-30)">
              <path d="M 0,0 C -92,-34 -86,-135 0,-182 C 86,-135 92,-34 0,0" />
            </g>
            <g transform="rotate(270) translate(0,-30)">
              <path d="M 0,0 C -92,-34 -86,-135 0,-182 C 86,-135 92,-34 0,0" />
            </g>
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
