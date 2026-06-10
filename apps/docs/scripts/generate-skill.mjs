#!/usr/bin/env node
// Generate skills/admin-design-system/ from apps/docs/src/content/docs/**/*.mdx.
// Output is committed; CI verifies it via `git diff --exit-code -- skills`.

import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(SCRIPT_DIR, "..", "src", "content", "docs");
const REPO_ROOT = join(SCRIPT_DIR, "..", "..", "..");
const SKILL_DIR = join(REPO_ROOT, "skills", "admin-design-system");
const REF_DIR = join(SKILL_DIR, "references");
const HEADER_FILE = join(SCRIPT_DIR, "skill-header.md");

const TOP_LEVEL_ORDER = ["getting-started", "basics", "components", "modules"];
const GROUP_TITLES = {
  "getting-started": "Getting started",
  basics: "Basics",
  components: "Components",
  modules: "Modules",
};

function listMdx(dir) {
  const out = [];
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listMdx(full));
    else if (entry.endsWith(".mdx")) out.push(full);
  }
  return out;
}

function parseFrontmatter(src) {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { fm: {}, body: src };
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fm[m[1]] = value;
  }
  return { fm, body: src.slice(match[0].length) };
}

// Run `transform` over each chunk of `body` outside fenced code blocks.
// `:::example` containers count as fences — their html/tsx fences must stay
// verbatim for rewriteExamples.
function transformProseOnly(body, transform) {
  const lines = body.split("\n");
  const out = [];
  let buffer = [];
  let fenceMarker = null;
  let inExample = false;

  const flushProse = () => {
    if (buffer.length === 0) return;
    out.push(transform(buffer.join("\n")));
    buffer = [];
  };

  for (const line of lines) {
    if (fenceMarker) {
      out.push(line);
      const closer = line.match(/^(`{3,}|~{3,})\s*$/);
      if (closer && line.startsWith(fenceMarker)) fenceMarker = null;
      continue;
    }
    if (inExample) {
      out.push(line);
      if (/^:::\s*$/.test(line)) inExample = false;
      continue;
    }
    const fenceOpen = line.match(/^(`{3,}|~{3,})/);
    if (fenceOpen) {
      flushProse();
      out.push(line);
      fenceMarker = fenceOpen[1];
      continue;
    }
    if (/^:::example\b/.test(line)) {
      flushProse();
      out.push(line);
      inExample = true;
      continue;
    }
    buffer.push(line);
  }
  flushProse();
  return out.join("\n");
}

// Best-effort stripping of MDX-only constructs from prose. Component pages
// don't use these wrappers — this mostly cleans up the landing page.
function stripMdxNoiseInProse(prose) {
  prose = prose.replace(/^\s*import\s[^\n]*?;?\s*$/gm, "");

  prose = prose.replace(/^\s*<\/?CardGrid>\s*$/gm, "");

  prose = prose.replace(/^\s*<Card\s[^>]*>\s*$/gm, (line) => {
    const title = line.match(/title="([^"]+)"/)?.[1];
    return title ? `**${title}**` : "";
  });
  prose = prose.replace(/^\s*<\/Card>\s*$/gm, "");

  prose = prose.replace(/<LinkCard\b([\s\S]*?)\/>/g, (_, attrs) => {
    const title = attrs.match(/title="([^"]+)"/)?.[1];
    const tplHref = attrs.match(/href=\{`\$\{import\.meta\.env\.BASE_URL\}([^`}]+)`\}/)?.[1];
    const litHref = attrs.match(/href="([^"]+)"/)?.[1];
    const href = tplHref ? `/${tplHref}` : litHref;
    const desc = attrs.match(/description="([^"]+)"/)?.[1];
    if (title && href) return `- [${title}](${href})${desc ? ` — ${desc}` : ""}`;
    if (title) return desc ? `- **${title}** — ${desc}` : `- ${title}`;
    return "";
  });

  return prose;
}

function stripMdxNoise(body, info, pageMap) {
  const stripped = transformProseOnly(body, (prose) =>
    rewriteRelativeLinksInProse(stripMdxNoiseInProse(prose), info, pageMap),
  );
  // Collapsing blank-line runs is harmless inside code blocks too.
  return stripped.replace(/\n{3,}/g, "\n\n");
}

// Starlight serves docs from directory-style URLs with a trailing slash
// (`a/index.mdx` → `/a/`); relative prose links resolve against this.
function pageUrlFor(rel) {
  const slug = rel.replace(/\.mdx$/, "").replace(/\/index$/, "");
  return `/${slug}/`;
}

// Point intra-docs relative links (`[Kbd](../kbd/)`) at the per-page skill
// files — Starlight's directory routes don't exist in the skill tree. Unknown
// targets are left as-is.
function rewriteRelativeLinksInProse(prose, info, pageMap) {
  const pageUrl = pageUrlFor(info.rel);
  return prose.replace(/\]\((\.\.?\/[^)\s]*)\)/g, (whole, href) => {
    const rewritten = resolveDocLink(href, pageUrl, info.outRel, pageMap);
    return rewritten ? `](${rewritten})` : whole;
  });
}

function resolveDocLink(href, pageUrl, currentOutRel, pageMap) {
  const url = new URL(href, `https://docs${pageUrl}`);
  const targetSlug = url.pathname.replace(/^\/+|\/+$/g, "");
  const targetOutRel = pageMap.get(targetSlug);
  if (!targetOutRel) return null;
  const rel = posix.relative(posix.dirname(currentOutRel), targetOutRel);
  return `${rel}${url.hash}`;
}

function rewriteExamples(body) {
  return body.replace(/^:::example[ \t]*\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm, (_, inner) => {
    const fences = [];
    const fenceRe = /^```(html|tsx|jsx)[ \t]*\r?\n([\s\S]*?)\r?\n```[ \t]*$/gm;
    let m;
    while ((m = fenceRe.exec(inner)) !== null) {
      const lang = m[1] === "jsx" ? "tsx" : m[1];
      fences.push(`\`\`\`${lang}\n${m[2]}\n\`\`\``);
    }
    if (fences.length === 0) return "";
    return ["**Example**", "", fences.join("\n\n")].join("\n");
  });
}

function transformPage(src, info, pageMap) {
  const { fm, body } = parseFrontmatter(src);
  const cleaned = rewriteExamples(stripMdxNoise(body, info, pageMap)).trim();
  const header =
    `# ${fm.title || "Untitled"}\n` + (fm.description ? `\n> ${fm.description}\n` : "");
  return `${header}\n${cleaned}\n`;
}

function describePage(absPath) {
  const rel = relative(DOCS_DIR, absPath).replaceAll("\\", "/");
  const group = rel.split("/")[0];
  const outRel = rel.replace(/\.mdx$/, ".md");
  return { rel, group, outRel, refRel: `references/${outRel}` };
}

function labelFor(rel, fm) {
  const isIndex = rel.endsWith("/index.mdx");
  const slug = rel.replace(/\.mdx$/, "").replace(/\/index$/, "");
  const parts = slug.split("/").slice(1);
  if (parts.length === 0) return fm.title || ""; // shouldn't happen — root index is skipped
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  if (parts.length === 1) {
    // Section index: use the dir name ("Forms") over the frontmatter title
    // ("Usage") so it sorts with its siblings.
    return isIndex ? capitalize(parts[0]) : fm.title || parts[0];
  }
  return `${capitalize(parts[0])}: ${fm.title || parts[parts.length - 1]}`;
}

function buildSkillMd(pages) {
  const grouped = new Map();
  for (const group of TOP_LEVEL_ORDER) grouped.set(group, []);

  for (const page of pages) {
    const entries = grouped.get(page.group);
    if (!entries) continue;
    entries.push(page);
  }

  const sections = [];
  for (const group of TOP_LEVEL_ORDER) {
    const entries = grouped.get(group) ?? [];
    if (entries.length === 0) continue;
    entries.sort((a, b) => a.label.localeCompare(b.label));
    sections.push(`### ${GROUP_TITLES[group]}`);
    sections.push("");
    for (const entry of entries) {
      const desc = entry.description ? ` — ${entry.description}` : "";
      sections.push(`- [${entry.label}](${entry.refRel})${desc}`);
    }
    sections.push("");
  }

  const header = readFileSync(HEADER_FILE, "utf8").replace(/\s+$/, "");
  return `${header}\n\n## Reference index\n\n${sections.join("\n").trimEnd()}\n`;
}

function main() {
  // Wipe and recreate the output tree so deletions in the docs propagate.
  rmSync(SKILL_DIR, { recursive: true, force: true });
  mkdirSync(REF_DIR, { recursive: true });

  const mdxFiles = listMdx(DOCS_DIR);

  const included = mdxFiles
    .map((abs) => ({ abs, info: describePage(abs) }))
    // Skip the root splash page (SKILL.md's header covers the overview) and
    // groups not surfaced in the skill index (e.g. `contributing/`).
    .filter(({ info }) => info.rel !== "index.mdx" && TOP_LEVEL_ORDER.includes(info.group));

  // URL slug → skill file, so relative cross-links can be rewritten.
  const pageMap = new Map(
    included.map(({ info }) => [
      info.rel.replace(/\.mdx$/, "").replace(/\/index$/, ""),
      info.outRel,
    ]),
  );

  const pages = [];

  for (const { abs, info } of included) {
    const src = readFileSync(abs, "utf8");
    const { fm } = parseFrontmatter(src);
    const out = transformPage(src, info, pageMap);

    const outPath = join(REF_DIR, info.outRel);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, out, "utf8");

    pages.push({
      ...info,
      label: labelFor(info.rel, fm),
      description: fm.description ?? "",
    });
  }

  pages.sort((a, b) => a.rel.localeCompare(b.rel));
  writeFileSync(join(SKILL_DIR, "SKILL.md"), buildSkillMd(pages), "utf8");

  console.log(
    `Generated ${pages.length} references + SKILL.md → ${relative(REPO_ROOT, SKILL_DIR)}`,
  );
}

main();
