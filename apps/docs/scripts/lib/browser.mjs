// Chromium lookup and a small task pool shared by the screenshot scripts.

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

/** Content types for the files the scripts serve to Chromium. */
export const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
};

/**
 * Path of the Chromium to launch: `CHROME_PATH`, else the first of chromium /
 * google-chrome on PATH, else playwright-core's downloaded build.
 *
 * @returns {string | null} Null when none is found.
 */
export function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  for (const name of ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable"]) {
    try {
      return execFileSync("which", [name], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
    } catch {}
  }
  const bundled = chromium.executablePath();
  return existsSync(bundled) ? bundled : null;
}

/**
 * Runs `tasks` with at most `limit` in flight; results keep task order. Each
 * task gets its worker's `local` object, for state reused across its tasks.
 *
 * @template T
 * @param {((local: Record<string, any>) => Promise<T>)[]} tasks
 * @param {number} limit
 * @returns {Promise<T[]>}
 */
export async function pool(tasks, limit) {
  const results = Array.from({ length: tasks.length });
  let next = 0;
  const worker = async () => {
    const local = {};
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i](local);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}
