#!/usr/bin/env node
// Generate skills/admin-design-system/ from apps/docs/src/content/docs/**/*.mdx.
// Runs via `pnpm generate-skill` (workspace root) or `pnpm --filter docs generate-skill`.
// Output is committed and verified in CI via `git diff --exit-code -- skills`.

import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
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

// Run `transform` over each chunk of `body` that is NOT inside a fenced code
// block. The `:::example` container directive is treated like a fence — its
// children (which include the html/tsx fences we want to preserve verbatim)
// must not be touched by MDX-noise stripping; rewriteExamples handles them.
function transformProseOnly(body, transform) {
  const lines = body.split("\n");
  const out = [];
  let buffer = [];
  let fenceMarker = null; // backtick/tilde run that opened the current fence
  let inExample = false;

  const flushProse = () => {
    if (buffer.length === 0) return;
    out.push(transform(buffer.join("\n")));
    buffer = [];
  };

  for (const line of lines) {
    if (fenceMarker) {
      // Inside a fenced code block — preserve verbatim until the closer.
      out.push(line);
      const closer = line.match(/^(`{3,}|~{3,})\s*$/);
      if (closer && line.startsWith(fenceMarker)) fenceMarker = null;
      continue;
    }
    if (inExample) {
      // Inside a :::example container — preserve verbatim until the closer.
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

// Best-effort stripping of MDX-only constructs from prose segments. The
// high-value content (component pages) doesn't use these wrappers — this is
// mostly cleaning up the landing page and a few prose paragraphs that import
// Starlight components at the top.
function stripMdxNoiseInProse(prose) {
  // Bare `import ... from "...";` lines.
  prose = prose.replace(/^\s*import\s[^\n]*?;?\s*$/gm, "");

  // <CardGrid> open/close tags on their own line — drop entirely.
  prose = prose.replace(/^\s*<\/?CardGrid>\s*$/gm, "");

  // <Card title="X" ...> opening tag → replace with bold title.
  prose = prose.replace(/^\s*<Card\s[^>]*>\s*$/gm, (line) => {
    const title = line.match(/title="([^"]+)"/)?.[1];
    return title ? `**${title}**` : "";
  });
  prose = prose.replace(/^\s*<\/Card>\s*$/gm, "");

  // Self-closing <LinkCard ... /> — flatten to a markdown list item.
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

function stripMdxNoise(body) {
  const stripped = transformProseOnly(body, stripMdxNoiseInProse);
  // Collapse 3+ consecutive blank lines into 2 (safe across the whole body —
  // doesn't change code-block contents because fences don't have blank-line
  // runs unless the author put them there, and even then collapsing is fine).
  return stripped.replace(/\n{3,}/g, "\n\n");
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

function transformPage(src) {
  const { fm, body } = parseFrontmatter(src);
  const cleaned = rewriteExamples(stripMdxNoise(body)).trim();
  const header =
    `# ${fm.title || "Untitled"}\n` + (fm.description ? `\n> ${fm.description}\n` : "");
  return `${header}\n${cleaned}\n`;
}

// Resolve a source MDX path to its output details.
// e.g. .../components/forms/inputs.mdx
//   → { group: "components", outRel: "components/forms/inputs.md", refRel: "references/components/forms/inputs.md" }
function describePage(absPath) {
  const rel = relative(DOCS_DIR, absPath).replaceAll("\\", "/");
  const group = rel.split("/")[0]; // "components", "basics", ...
  const outRel = rel.replace(/\.mdx$/, ".md");
  return { rel, group, outRel, refRel: `references/${outRel}` };
}

function labelFor(rel, fm) {
  // rel is "components/forms/inputs.mdx" or "components/buttons.mdx"
  const isIndex = rel.endsWith("/index.mdx");
  const slug = rel.replace(/\.mdx$/, "").replace(/\/index$/, "");
  const parts = slug.split("/").slice(1); // drop the group dir
  if (parts.length === 0) return fm.title || ""; // shouldn't happen — root index is skipped
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  if (parts.length === 1) {
    // Section index (e.g. forms/index.mdx) → use the dir name ("Forms") rather
    // than the frontmatter title ("Usage") so it sorts with its siblings.
    return isIndex ? capitalize(parts[0]) : fm.title || parts[0];
  }
  // Nested: "Forms: Inputs"
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
  const pages = [];

  for (const abs of mdxFiles) {
    const info = describePage(abs);
    // Skip the root index.mdx — its content is the project splash; the
    // SKILL.md header already covers the overview.
    if (info.rel === "index.mdx") continue;
    // Skip top-level groups that aren't surfaced in the skill index (e.g.
    // `contributing/` — for repo contributors, not for consuming agents).
    if (!TOP_LEVEL_ORDER.includes(info.group)) continue;

    const src = readFileSync(abs, "utf8");
    const { fm } = parseFrontmatter(src);
    const out = transformPage(src);

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
