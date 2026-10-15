import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

const PAPER = "#f9f4e8";
const PINE = "#2c5f63";
const RUST = "#d97b51";
const INK = "#1c1915";

const LINES = [
  ["Protein", "Chicken thighs, ground beef, eggs", "$19"],
  ["Starch", "Rice, potatoes, pasta, tortillas", "$11"],
  ["Two nights each", "Mon chicken is Tue quesadillas", ""],
] as const;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PINE,
          color: PAPER,
          padding: "64px",
          fontFamily: "system-ui, sans-serif",
          gap: "56px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
            {site.name} · Free printable
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 76, lineHeight: 1.02, fontWeight: 800 }}>7 family dinners for $44.</div>
            <div style={{ fontSize: 32, lineHeight: 1.3, color: "#f0e6d4" }}>
              The free grocery list where every item covers two nights. Walmart prices.
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: RUST, fontWeight: 700 }}>brokedadsclub.com</div>
        </div>

        <div
          style={{
            width: 380,
            display: "flex",
            flexDirection: "column",
            background: "#ffffff",
            color: INK,
            padding: "36px",
            borderRadius: 8,
            transform: "rotate(2deg)",
          }}
        >
          <div style={{ display: "flex", fontSize: 16, letterSpacing: "0.2em", textTransform: "uppercase", color: PINE, fontWeight: 700 }}>
            Grocery week
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#5c554b", marginTop: 8, paddingBottom: 18, borderBottom: `3px solid ${INK}` }}>
            7 dinners · 3-4 people
          </div>
          {LINES.map(([label, items, price]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", marginTop: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5c554b", fontWeight: 700 }}>
                <span>{label}</span>
                <span>{price}</span>
              </div>
              <div style={{ display: "flex", fontSize: 22, marginTop: 6 }}>{items}</div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", paddingTop: 18, borderTop: `2px solid ${INK}`, fontSize: 30, fontWeight: 800 }}>
            <span>Total</span>
            <span style={{ color: PINE }}>$44.04</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, immutable" } },
  );
}
