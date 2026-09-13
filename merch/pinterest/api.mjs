import { readFileSync, writeFileSync, existsSync } from "node:fs";
import {
  loadEnv,
  requireConfig,
  tokensPath,
  PINTEREST_SCOPES,
} from "./env.mjs";

const API = "https://api.pinterest.com/v5";
const TOKEN_URL = "https://api.pinterest.com/v5/oauth/token";

export function readTokens() {
  if (!existsSync(tokensPath)) return null;
  return JSON.parse(readFileSync(tokensPath, "utf8"));
}

export function writeTokens(tokens) {
  writeFileSync(tokensPath, `${JSON.stringify(tokens, null, 2)}\n`);
}

export function authUrl({ appId, redirectUri, state = "bdc" }) {
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: PINTEREST_SCOPES,
    state,
  });
  return `https://www.pinterest.com/oauth/?${params}`;
}

export async function exchangeCode(code) {
  const { appId, appSecret, redirectUri } = requireConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    continuous_refresh: "true",
  });
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${appId}:${appSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  }
  const saved = {
    ...data,
    obtained_at: new Date().toISOString(),
  };
  writeTokens(saved);
  return saved;
}

export async function refreshAccessToken(tokens = readTokens()) {
  if (!tokens?.refresh_token) {
    throw new Error("No refresh_token. Run: node merch/pinterest/auth.mjs");
  }
  const { appId, appSecret } = requireConfig();
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: tokens.refresh_token,
    continuous_refresh: "true",
  });
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${appId}:${appSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
  }
  const saved = {
    ...tokens,
    ...data,
    refresh_token: data.refresh_token || tokens.refresh_token,
    obtained_at: new Date().toISOString(),
  };
  writeTokens(saved);
  return saved;
}

function tokenLooksExpired(tokens) {
  if (!tokens?.access_token || !tokens?.expires_in || !tokens?.obtained_at) {
    return true;
  }
  const obtained = Date.parse(tokens.obtained_at);
  // refresh 1 day early
  const expiresAt = obtained + (Number(tokens.expires_in) - 86_400) * 1000;
  return Date.now() >= expiresAt;
}

export async function getAccessToken() {
  loadEnv();
  let tokens = readTokens();
  if (!tokens?.access_token) {
    throw new Error("Not authorized. Run: node merch/pinterest/auth.mjs");
  }
  if (tokenLooksExpired(tokens) && tokens.refresh_token) {
    tokens = await refreshAccessToken(tokens);
  }
  return tokens.access_token;
}

export async function pinterest(path, { method = "GET", body } = {}) {
  const token = await getAccessToken();
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "BrokeDadsClub/1.0 (https://brokedadsclub.com)",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text.slice(0, 800) };
  }
  if (!response.ok) {
    throw new Error(
      `Pinterest ${method} ${path} → ${response.status}: ${JSON.stringify(data)}`,
    );
  }
  return data;
}

export async function listBoards() {
  const data = await pinterest("/boards?page_size=50");
  return data.items ?? [];
}

export async function createPin(payload) {
  return pinterest("/pins", { method: "POST", body: payload });
}
