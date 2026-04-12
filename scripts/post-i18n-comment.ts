/**
 * Post or update a single PR comment from `sync-i18n.ts --ci|--ci-strict --json` output.
 *
 * Usage (GitHub Actions):
 *   npx -y tsx@4.19.2 scripts/post-i18n-comment.ts i18n-result.json
 *
 * Env: GITHUB_TOKEN, GITHUB_REPOSITORY, and either GITHUB_REF (refs/pull/N/merge) or GITHUB_EVENT_PATH.
 */

import { readFileSync } from "node:fs";
import { LOCALE_LABELS, type Locale } from "../lib/i18n/index";

const BOT_MARKER = "<!-- i18n-bot -->";
const API = "https://api.github.com";

type CiResult = {
  mode?: string;
  exitIntent?: number;
  scope?: string;
  newMissing?: Record<string, string[]>;
  summary?: { totalNewKeys?: number; affectedLocales?: number; affectedScopes?: number };
  newMissingByScope?: Record<string, Record<string, string[]>>;
  error?: string;
  message?: string;
};

function usage(): void {
  console.error("Usage: npx -y tsx@4.19.2 scripts/post-i18n-comment.ts <path-to-json>");
}

function parseRepo(): { owner: string; repo: string } | null {
  const raw = process.env.GITHUB_REPOSITORY;
  if (!raw || !raw.includes("/")) return null;
  const [owner, repo] = raw.split("/", 2);
  if (!owner || !repo) return null;
  return { owner, repo };
}

function resolvePrNumber(): number | null {
  const fromRef = process.env.GITHUB_REF?.match(/refs\/pull\/(\d+)\//)?.[1];
  if (fromRef) return parseInt(fromRef, 10);
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath) {
    try {
      const ev = JSON.parse(readFileSync(eventPath, "utf8")) as { pull_request?: { number?: number } };
      if (typeof ev.pull_request?.number === "number") return ev.pull_request.number;
    } catch {
      /* ignore */
    }
  }
  const manual = process.env.PR_NUMBER;
  if (manual && /^\d+$/.test(manual)) return parseInt(manual, 10);
  return null;
}

function localeHeading(code: string): string {
  const label = LOCALE_LABELS[code as Locale] ?? code;
  return `#### ${label} (\`${code}\`)`;
}

function formatKeyList(keys: string[]): string {
  return keys.map((k) => `- \`${k.replace(/`/g, "`\u200b`")}\``).join("\n");
}

function formatDiffBlock(keys: string[]): string {
  const lines = keys.map((k) => `+ ${k}`);
  return ["```text", ...lines, "```"].join("\n");
}

function buildBody(data: CiResult): string {
  const parts: string[] = [BOT_MARKER, "", "## i18n check failed", "", "New missing translations detected (vs baseline).", ""];

  if (data.mode === "ci" && data.scope && data.newMissing) {
    parts.push(`### Scope: \`${data.scope}\``, "");
    for (const loc of Object.keys(data.newMissing).sort()) {
      const keys = data.newMissing[loc]!;
      if (keys.length === 0) continue;
      parts.push(localeHeading(loc), "", formatKeyList(keys), "", "<details>", "<summary>Path list (copy)</summary>", "", formatDiffBlock(keys), "", "</details>", "");
    }
    parts.push("---", "", "## How to fix", "", "Run:", "", "```bash", `npm run i18n:baseline -- --scope ${data.scope}`, "```", "", "Or update locale files under `lib/i18n/locales/`.", "");
  } else if (data.mode === "ci-strict" && data.newMissingByScope) {
    for (const scope of Object.keys(data.newMissingByScope).sort()) {
      const byLoc = data.newMissingByScope[scope]!;
      parts.push(`### Scope: \`${scope}\``, "");
      for (const loc of Object.keys(byLoc).sort()) {
        const keys = byLoc[loc]!;
        if (keys.length === 0) continue;
        parts.push(localeHeading(loc), "", formatKeyList(keys), "", "<details>", "<summary>Path list (copy)</summary>", "", formatDiffBlock(keys), "", "</details>", "");
      }
    }
    parts.push("---", "", "## How to fix", "", "Refresh all dict scopes:", "", "```bash", "npm run i18n:baseline:all", "```", "", "Or per scope:", "", "```bash");
    for (const scope of Object.keys(data.newMissingByScope).sort()) {
      parts.push(`npm run i18n:baseline -- --scope ${scope}`);
    }
    parts.push("```", "", "Or update locale files under `lib/i18n/locales/`.", "");
  }

  const s = data.summary;
  if (s && typeof s.totalNewKeys === "number") {
    parts.push("---", "", "## Summary", "", `- **${s.totalNewKeys}** new missing key(s)`);
    if (typeof s.affectedLocales === "number") {
      parts.push(`- **${s.affectedLocales}** affected locale(s)`);
    }
    if (typeof s.affectedScopes === "number") {
      parts.push(`- **${s.affectedScopes}** affected scope(s)`);
    }
    parts.push("");
  }

  return parts.join("\n");
}

function shouldPostComment(data: CiResult): data is CiResult & { exitIntent: 1 } {
  if (data.exitIntent !== 1) return false;
  if (data.mode === "ci" && data.newMissing) {
    return Object.values(data.newMissing).some((a) => a.length > 0);
  }
  if (data.mode === "ci-strict" && data.newMissingByScope) {
    return Object.values(data.newMissingByScope).some((byLoc) => Object.values(byLoc).some((a) => a.length > 0));
  }
  return false;
}

async function githubFetch(
  token: string,
  path: string,
  init: RequestInit & { method?: string } = {},
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API}${path}`;
  return fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
      "User-Agent": "moja-app-i18n-bot",
      ...(init.headers as Record<string, string>),
    },
  });
}

async function findExistingBotCommentId(
  token: string,
  owner: string,
  repo: string,
  issueNumber: number,
): Promise<number | null> {
  const path = `/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=100`;
  const res = await githubFetch(token, path);
  if (!res.ok) return null;
  const comments = (await res.json()) as Array<{ id: number; body?: string | null }>;
  for (const c of comments) {
    if (c.body?.includes(BOT_MARKER)) return c.id;
  }
  return null;
}

async function upsertComment(
  token: string,
  owner: string,
  repo: string,
  issueNumber: number,
  body: string,
): Promise<void> {
  const existingId = await findExistingBotCommentId(token, owner, repo, issueNumber);
  if (existingId !== null) {
    const res = await githubFetch(token, `/repos/${owner}/${repo}/issues/comments/${existingId}`, {
      method: "PATCH",
      body: JSON.stringify({ body }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`PATCH comment failed: ${res.status} ${t}`);
    }
    return;
  }
  const res = await githubFetch(token, `/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`POST comment failed: ${res.status} ${t}`);
  }
}

async function main(): Promise<void> {
  const pathArg = process.argv[2] ?? "i18n-result.json";
  if (pathArg === "--help" || pathArg === "-h") {
    usage();
    process.exit(2);
    return;
  }

  let raw: string;
  try {
    raw = readFileSync(pathArg, "utf8").replace(/^\uFEFF/, "");
  } catch {
    console.error(`[i18n:pr-comment] Cannot read ${pathArg}`);
    process.exit(2);
    return;
  }

  let data: CiResult;
  try {
    data = JSON.parse(raw) as CiResult;
  } catch {
    console.error("[i18n:pr-comment] Invalid JSON");
    process.exit(2);
    return;
  }

  if (!shouldPostComment(data)) {
    console.log("[i18n:pr-comment] Nothing to post (no new missing keys or not a failure state).");
    process.exit(0);
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = parseRepo();
  const pr = resolvePrNumber();

  if (!token || !repo || pr === null) {
    console.warn(
      "[i18n:pr-comment] Missing GITHUB_TOKEN, GITHUB_REPOSITORY, or PR context — skipping API call.",
    );
    process.exit(0);
    return;
  }

  const body = buildBody(data);

  try {
    await upsertComment(token, repo.owner, repo.repo, pr, body);
    console.log(`[i18n:pr-comment] Updated PR #${pr} comment.`);
  } catch (e) {
    console.warn("[i18n:pr-comment] GitHub API error (non-fatal):", e);
    process.exit(0);
  }
}

void main();
