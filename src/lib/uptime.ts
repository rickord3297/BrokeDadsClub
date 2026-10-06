import fs from "node:fs";
import path from "node:path";
import { getGuides } from "@/lib/guides";
import { isSesConfigured, sendSesEmail } from "@/lib/ses";
import { site } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

export type WatchedSite = {
  name: string;
  url: string;
};

export type CheckResult = {
  name: string;
  ok: boolean;
  status?: number;
  ms?: number;
  detail?: string;
  skipped?: boolean;
};

type WatchFile = {
  sites?: Array<{ name?: unknown; url?: unknown }>;
};

const WATCH_FILE = path.join(process.cwd(), "content/uptime-sites.json");
const PROBE_TIMEOUT_MS = 12_000;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getWatchedSites(): WatchedSite[] {
  if (!fs.existsSync(WATCH_FILE)) return [];
  const parsed = JSON.parse(fs.readFileSync(WATCH_FILE, "utf8")) as WatchFile;
  if (!Array.isArray(parsed.sites)) return [];
  return parsed.sites.flatMap((row) => {
    if (typeof row.name !== "string" || !row.name.trim()) return [];
    if (typeof row.url !== "string" || !isHttpUrl(row.url)) return [];
    return [{ name: row.name.trim(), url: row.url.trim() }];
  });
}

export async function probeUrl(
  url: string,
  init: RequestInit = {},
): Promise<Pick<CheckResult, "ok" | "status" | "ms" | "detail">> {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      ...init,
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
      headers: {
        "user-agent": "BrokeDadsClub-uptime/1.0",
        ...(init.headers ?? {}),
      },
    });
    return {
      ok: response.ok,
      status: response.status,
      ms: Date.now() - started,
      detail: response.ok ? "ok" : `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      ms: Date.now() - started,
      detail: error instanceof Error ? error.message : "Request failed",
    };
  }
}

export function checkGuides(): CheckResult {
  try {
    const live = getGuides().length;
    return {
      name: "guides",
      ok: live > 0,
      detail: live > 0 ? `${live} live guides` : "No live guides found",
    };
  } catch (error) {
    return {
      name: "guides",
      ok: false,
      detail: error instanceof Error ? error.message : "Could not read guides",
    };
  }
}

export async function pingSupabase(): Promise<CheckResult> {
  const client = createAdminClient() ?? createPublicClient();
  if (!client) {
    return {
      name: "supabase",
      ok: true,
      skipped: true,
      detail: "Not configured",
    };
  }

  const started = Date.now();
  const { error } = await client
    .from("subscribers")
    .select("email", { count: "exact", head: true })
    .limit(1);

  if (error) {
    return {
      name: "supabase",
      ok: false,
      ms: Date.now() - started,
      detail: error.message,
    };
  }

  return {
    name: "supabase",
    ok: true,
    ms: Date.now() - started,
    detail: "reachable",
  };
}

export async function buildLocalHealth() {
  const guides = checkGuides();
  const supabase = await pingSupabase();
  const checks = [guides, supabase];
  const ok = guides.ok;
  return {
    ok,
    service: "brokedadsclub",
    checkedAt: new Date().toISOString(),
    checks,
  };
}

export async function checkWatchedSites(): Promise<CheckResult[]> {
  const sites = getWatchedSites();
  return Promise.all(
    sites.map(async (siteRow) => {
      const probe = await probeUrl(siteRow.url);
      return {
        name: siteRow.name,
        ...probe,
      };
    }),
  );
}

export async function alertIfDown(failures: CheckResult[]): Promise<boolean> {
  if (failures.length === 0 || !isSesConfigured()) return false;

  const lines = failures.map((item) => {
    const status = item.status != null ? `HTTP ${item.status}` : item.detail;
    return `- ${item.name}: ${status ?? "down"}`;
  });

  await sendSesEmail({
    to: site.email,
    subject: `[uptime] ${failures.length} site${failures.length === 1 ? "" : "s"} down`,
    text: `Uptime check failed:\n\n${lines.join("\n")}\n`,
    html: `<p>Uptime check failed:</p><ul>${failures
      .map((item) => {
        const status = item.status != null ? `HTTP ${item.status}` : item.detail;
        return `<li>${escapeHtml(item.name)}: ${escapeHtml(status ?? "down")}</li>`;
      })
      .join("")}</ul>`,
  });

  return true;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
