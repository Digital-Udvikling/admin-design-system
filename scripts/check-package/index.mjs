#!/usr/bin/env node
/**
 * Checks the packages as npm ships them: packs both, lints the tarballs
 * (publint, plus arethetypeswrong for admin-react), installs them into a temp
 * project, then imports and server-renders admin-react, evaluates it under the
 * `react-server` condition with "use client" modules as client references, and
 * resolves every CSS subpath and the relative `url()`s (fonts) inside it. Needs `pnpm build` first and network access for
 * the install. Exits non-zero on the first failure.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const PACKAGES = ["admin-css", "admin-react"];

const PLAIN = `
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import * as admin from "@aortl/admin-react";

for (const name of ["AdminRoot", "Button", "Card", "Select", "Menu", "Dialog", "useConfirm"]) {
  if (admin[name] === undefined) throw new Error(name + " is not exported");
}
const html = renderToString(
  h(admin.AdminRoot, null, h(admin.Card, { title: "Orders" }, h(admin.Button, { variant: "primary" }, "Save"))),
);
if (!html.includes("_ao-btn")) throw new Error("server render lacks _ao-btn: " + html);
console.log("  ok: " + Object.keys(admin).length + " exports, server render emits prefixed classes");
`;

const SERVER = `
import { register } from "node:module";
register(${JSON.stringify(pathToFileURL(join(HERE, "client-references.mjs")).href)});
const admin = await import("@aortl/admin-react");
for (const [root, part] of [["Select", "Trigger"], ["Sidebar", "Item"], ["Menu", "Item"], ["Card", "Body"]]) {
  if (admin[root]?.[part] === undefined) throw new Error(root + "." + part + " is missing under react-server");
}
console.log("  ok: " + Object.keys(admin).length + " exports evaluate with client modules as references");
`;

const CSS = `
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const specifiers = [
  "@aortl/admin-react/styles.css",
  "@aortl/admin-react/styles.scoped.css",
  "@aortl/admin-css",
  ...["admin", "admin.scoped", "admin.utilities"].flatMap((f) => [
    "@aortl/admin-css/" + f + ".css",
    "@aortl/admin-css/" + f + ".min.css",
  ]),
];
let assets = 0;
for (const s of specifiers) {
  const url = import.meta.resolve(s);
  const path = fileURLToPath(url);
  if (!existsSync(path)) throw new Error(s + " resolves to a missing file: " + path);
  for (const [, ref] of readFileSync(path, "utf8").matchAll(/url\\(["']?(\\.[^"')]+)["']?\\)/g)) {
    const asset = fileURLToPath(new URL(ref, url));
    if (!existsSync(asset)) throw new Error(s + " references a missing file: " + ref);
    assets++;
  }
}
console.log("  ok: " + specifiers.length + " CSS subpaths resolve, with " + assets + " relative url()s");
`;

const run = (cmd, args, cwd = ROOT) =>
  execFileSync(cmd, args, { cwd, stdio: ["ignore", "inherit", "inherit"] });
const step = (title) => console.log(`\n▸ ${title}`);

const work = mkdtempSync(join(tmpdir(), "admin-check-package-"));
try {
  step("pack");
  const tarballs = {};
  for (const name of PACKAGES) {
    const dir = join(ROOT, "packages", name);
    if (!existsSync(join(dir, "dist"))) {
      throw new Error(`packages/${name}/dist missing; run 'pnpm build' first`);
    }
    run("pnpm", ["pack", "--pack-destination", work], dir);
    // prepack copies the root changelog in; it is gitignored but needn't linger.
    rmSync(join(dir, "CHANGELOG.md"), { force: true });
    const file = readdirSync(work).find(
      (f) => f.startsWith(`aortl-${name}-`) && f.endsWith(".tgz"),
    );
    if (file === undefined) throw new Error(`no tarball for ${name}`);
    tarballs[name] = join(work, file);
  }

  step("publint");
  for (const name of PACKAGES) run("pnpm", ["exec", "publint", "run", tarballs[name], "--strict"]);

  step("arethetypeswrong (ESM only)");
  // CSS subpaths have no types to check; the resolve step below covers them.
  run("pnpm", [
    "exec",
    "attw",
    tarballs["admin-react"],
    "--profile",
    "esm-only",
    "--exclude-entrypoints",
    "./styles.css",
    "./styles.scoped.css",
  ]);

  step("install the tarballs into a temp project");
  const app = join(work, "app");
  mkdirSync(app);
  const reactVersion = execFileSync("node", ["-p", "require('react/package.json').version"], {
    cwd: join(ROOT, "packages", "admin-react"),
    encoding: "utf8",
  }).trim();
  writeFileSync(
    join(app, "package.json"),
    JSON.stringify({ name: "check-package-app", private: true }),
  );
  run(
    "npm",
    [
      "install",
      "--no-audit",
      "--no-fund",
      "--loglevel=error",
      tarballs["admin-css"],
      tarballs["admin-react"],
      `react@${reactVersion}`,
      `react-dom@${reactVersion}`,
    ],
    app,
  );

  step("import and server-render (plain Node ESM)");
  writeFileSync(join(app, "plain.mjs"), PLAIN);
  run("node", ["plain.mjs"], app);

  step('evaluate under the "react-server" condition');
  writeFileSync(join(app, "server.mjs"), SERVER);
  run("node", ["--conditions=react-server", "server.mjs"], app);

  step("resolve CSS subpaths");
  writeFileSync(join(app, "css.mjs"), CSS);
  run("node", ["css.mjs"], app);

  console.log("\nPackage check passed.");
} finally {
  rmSync(work, { recursive: true, force: true });
}
