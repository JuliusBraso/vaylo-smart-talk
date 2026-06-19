import * as fs from "fs";

const raw = fs.readFileSync(".env.local", "utf-8");
let key = "";
for (const line of raw.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq < 1) continue;
  const k = t.slice(0, eq).trim();
  const v = t.slice(eq + 1).trim();
  const stripped = (v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))
    ? v.slice(1, -1)
    : v;
  if (k === "OPENAI_API_KEY") { key = stripped; break; }
}

if (!key) {
  console.log("OPENAI_API_KEY not found in .env.local");
  process.exit(1);
}

console.log("Key length:", key.length);
console.log("Key prefix (safe):", key.slice(0, 7) + "...");

const r = await fetch("https://api.openai.com/v1/models", {
  headers: { Authorization: "Bearer " + key }
});
console.log("auth status:", r.status, r.statusText);
