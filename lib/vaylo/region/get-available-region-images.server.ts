import "server-only";

import fs from "fs";
import path from "path";

export function getAvailableRegionImageSlugs(): Set<string> {
  try {
    const regionsDir = path.join(process.cwd(), "public/backgrounds/regions");
    const files = fs.readdirSync(regionsDir);
    const detected = files
      .filter((file) => file.toLowerCase().endsWith(".jpg"))
      .map((file) => file.slice(0, -4).toLowerCase());

    return new Set(["default", ...detected]);
  } catch {
    return new Set(["default"]);
  }
}

