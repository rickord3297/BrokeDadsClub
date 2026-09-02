import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.shareTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#2c5f63",
          color: "#f9f4e8",
          padding: "72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: 28,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#f9f4e8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2c5f63",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            BDC
          </div>
          Broke Dads Club
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.05,
              fontWeight: 800,
              maxWidth: 900,
            }}
          >
            Practical family budget systems for dads
          </div>
          <div style={{ fontSize: 34, color: "#f0e6d4", maxWidth: 820 }}>
            {site.shareDescription}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#d97b51",
            fontWeight: 700,
          }}
        >
          <span>{site.tagline}</span>
          <span>brokedadsclub.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
