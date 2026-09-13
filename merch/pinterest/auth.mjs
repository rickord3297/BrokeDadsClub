#!/usr/bin/env node
/**
 * One-time Pinterest OAuth. Opens a browser, catches the redirect on localhost:8085,
 * exchanges the code for tokens, writes merch/pinterest/.tokens.json
 *
 * Before running:
 * 1. In developers.pinterest.com → your app → Redirect link: http://localhost:8085/
 * 2. Confirm PINTEREST_APP_ID + PINTEREST_APP_SECRET are in .env.local
 *
 * Usage: node merch/pinterest/auth.mjs
 */

import http from "node:http";
import { exec } from "node:child_process";
import { authUrl, exchangeCode } from "./api.mjs";
import { AUTH_PORT, requireConfig } from "./env.mjs";

const { appId, redirectUri } = requireConfig();
const url = authUrl({ appId, redirectUri });

const server = http.createServer(async (req, res) => {
  try {
    const incoming = new URL(req.url, `http://localhost:${AUTH_PORT}`);
    const code = incoming.searchParams.get("code");
    const error = incoming.searchParams.get("error");
    if (error) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end(`<h1>Auth failed</h1><pre>${error}</pre>`);
      server.close();
      process.exit(1);
    }
    if (!code) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing code");
      return;
    }
    const tokens = await exchangeCode(code);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<h1>Pinterest connected</h1><p>Tokens saved. You can close this tab and return to the terminal.</p>",
    );
    console.log("Saved access token. Scopes:", tokens.scope || "(unknown)");
    console.log("Next: node merch/pinterest/list-boards.mjs");
    server.close();
    process.exit(0);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(String(err));
    console.error(err);
    server.close();
    process.exit(1);
  }
});

server.listen(AUTH_PORT, () => {
  console.log(`Listening on ${redirectUri}`);
  console.log("Opening browser for Pinterest authorization…");
  console.log(url);
  const open =
    process.platform === "darwin"
      ? `open "${url}"`
      : process.platform === "win32"
        ? `start "" "${url}"`
        : `xdg-open "${url}"`;
  exec(open);
});
