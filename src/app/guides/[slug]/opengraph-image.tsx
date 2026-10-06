import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getGuide, getGuides } from "@/lib/guides";
import { site } from "@/lib/site";

export const alt = `${site.name} guide`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug }));
}

const assets = join(process.cwd(), "src/assets/og");

const COLORS = {
  paper: "#f9f4e8",
  rule: "#e0d3bc",
  ink: "#1c1915",
  inkSoft: "#5c5348",
  pine: "#2c5f63",
  rust: "#d97b51",
};

/** Big enough to read in a Reddit thumbnail, small enough that long titles fit in 3-4 lines. */
function titleFontSize(title: string) {
  const length = title.length;
  if (length <= 28) return 96;
  if (length <= 45) return 84;
  if (length <= 65) return 72;
  if (length <= 90) return 60;
  return 52;
}

function clampTitle(title: string, max = 120) {
  if (title.length <= max) return title;
  const cut = title.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export default async function GuideOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);

  const [fraunces, oswald, inter, logo] = await Promise.all([
    readFile(join(assets, "Fraunces-Bold.ttf")),
    readFile(join(assets, "Oswald-Bold.ttf")),
    readFile(join(assets, "Inter-SemiBold.ttf")),
    readFile(join(assets, "club-logo.jpg")),
  ]);
  const logoSrc = `data:image/jpeg;base64,${logo.toString("base64")}`;

  const title = clampTitle(guide?.title ?? "Practical guides for dads stretching every dollar");
  const kicker = guide ? `${guide.category} guide` : "Guides";
  const readTime = guide?.readTime ? `${guide.readTime} read` : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: COLORS.paper,
          padding: 28,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: `2px solid ${COLORS.rule}`,
            borderRadius: 28,
            padding: "52px 64px 40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontFamily: "Oswald",
              fontSize: 28,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            <div style={{ width: 40, height: 6, background: COLORS.rust, borderRadius: 3 }} />
            <span style={{ color: COLORS.pine }}>{kicker}</span>
            {readTime ? <span style={{ color: COLORS.inkSoft }}>· {readTime}</span> : null}
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: titleFontSize(title),
              lineHeight: 1.08,
              letterSpacing: -1,
              color: COLORS.ink,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: `2px solid ${COLORS.rule}`,
              paddingTop: 26,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <img
                src={logoSrc}
                alt=""
                width={84}
                height={84}
                style={{ borderRadius: 42 }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span
                  style={{
                    fontFamily: "Oswald",
                    fontSize: 34,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: COLORS.ink,
                  }}
                >
                  {site.name}
                </span>
                <span style={{ fontFamily: "Inter", fontSize: 22, color: COLORS.rust }}>
                  {site.tagline}
                </span>
              </div>
            </div>
            <span style={{ fontFamily: "Inter", fontSize: 24, color: COLORS.inkSoft }}>
              {site.domain}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 700, style: "normal" },
        { name: "Oswald", data: oswald, weight: 700, style: "normal" },
        { name: "Inter", data: inter, weight: 600, style: "normal" },
      ],
    },
  );
}
