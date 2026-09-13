import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const dir = dirname(fileURLToPath(import.meta.url));
export const repoRoot = join(dir, "../..");
export const tokensPath = join(dir, ".tokens.json");
export const publishedPath = join(dir, "published.json");
export const outputDir = join(dir, "output");

export const SITE_URL = "https://brokedadsclub.com";
export const REDIRECT_URI_DEFAULT = "http://localhost:8085/";
export const AUTH_PORT = 8085;

const SCOPES = [
  "user_accounts:read",
  "boards:read",
  "boards:write",
  "pins:read",
  "pins:write",
];

export const PINTEREST_SCOPES = SCOPES.join(",");

export function loadEnv(path = join(repoRoot, ".env.local")) {
  const env = { ...process.env };
  if (!existsSync(path)) return env;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1);
    if (env[key] === undefined || env[key] === "") env[key] = value;
  }
  return env;
}

export function requireConfig(env = loadEnv()) {
  const appId = env.PINTEREST_APP_ID;
  const appSecret = env.PINTEREST_APP_SECRET;
  const redirectUri = env.PINTEREST_REDIRECT_URI || REDIRECT_URI_DEFAULT;
  if (!appId || !appSecret) {
    throw new Error(
      "Missing PINTEREST_APP_ID or PINTEREST_APP_SECRET in .env.local",
    );
  }
  return { appId, appSecret, redirectUri, boardId: env.PINTEREST_BOARD_ID || "" };
}
