import { cn } from "@aortl/admin-react/internal";
import scopedCss from "@aortl/admin-css/admin.scoped.min.css?raw";
import { useEffect, useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { CommandPalette, type CommandPaletteProps } from "../CommandPalette";

export interface StandaloneOptions extends Omit<CommandPaletteProps, "className"> {
  /**
   * Stylesheet URLs loaded into the palette's shadow root, which the page's own CSS can't reach:
   * the Tabler webfont CSS for string icons. Default: none.
   */
  stylesheets?: readonly string[];
}

// Chrome ignores @font-face and @property inside a shadow tree; both work registered on the document.
const DOCUMENT_ONLY = /@(?:font-face|property)\b[^{]*\{[^}]*\}/g;

/** The scoped bundle split into document-level rules and the rest, font URLs made absolute. */
function splitCss(): { documentCss: string; shadowCss: string } {
  // The fonts ship beside this chunk, as they sit beside admin.scoped.css.
  const base = new URL(/* @vite-ignore */ "./", import.meta.url);
  const css = scopedCss.replace(/url\(\.\/(fonts\/[^)]+)\)/g, (_, path: string) => {
    return `url(${new URL(path, base).href})`;
  });
  const documentCss: string[] = [];
  const declared = new Set<string>();
  document.fonts?.forEach?.((font) => declared.add(font.family.replace(/["']/g, "")));
  const shadowCss = css.replace(DOCUMENT_ONLY, (rule) => {
    // A page on admin.css already declares the fonts; a second copy would download them again.
    const family = /font-family:\s*["']?([^"';]+)/.exec(rule)?.[1];
    if (!(family && declared.has(family))) documentCss.push(rule);
    return "";
  });
  return { documentCss: documentCss.join("\n"), shadowCss };
}

// Palette tones stay the system's own: a Tailwind page declares its own under the same names
// (`--color-blue-600`). The page's semantic roles already carry any tone it overrode.
const PALETTE_TONE = /^--color-(?:[a-z]+-\d+|paper|black|white)$/;

/** The semantic color tokens `css` declares, which a page may override on `<html>`. */
function semanticTokens(css: string): string[] {
  const names = new Set([...css.matchAll(/(--color-[a-z0-9-]+)\s*:/g)].map((m) => m[1] ?? ""));
  return [...names].filter((name) => name && !PALETTE_TONE.test(name));
}

interface PageStyle {
  /** `"dark"`/`"light"` when the page forces one through `color-scheme`. */
  theme: "light" | "dark" | undefined;
  /** The page's values for the semantic tokens, set on `<html>` by admin.css or its own overrides. */
  tokens: Record<string, string>;
}

function readPage(names: readonly string[]): PageStyle {
  const style = getComputedStyle(document.documentElement);
  const scheme = style.colorScheme;
  const tokens: Record<string, string> = {};
  for (const name of names) {
    const value = style.getPropertyValue(name).trim();
    if (value) tokens[name] = value;
  }
  return { theme: scheme === "dark" || scheme === "light" ? scheme : undefined, tokens };
}

/**
 * Follows the page's forced color scheme and color tokens, which the shadow root's own token
 * declarations would otherwise replace.
 */
function usePageStyle(names: readonly string[]): PageStyle {
  const [style, setStyle] = useState(() => readPage(names));
  useEffect(() => {
    const observer = new MutationObserver(() => setStyle(readPage(names)));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });
    return () => observer.disconnect();
  }, [names]);
  return style;
}

function App({ options, tokens }: { options: StandaloneOptions; tokens: readonly string[] }) {
  const { theme, tokens: values } = usePageStyle(tokens);
  const { stylesheets: _stylesheets, ...props } = options;
  // AdminRoot's markup without its confirm host, which would bundle Field and Input.
  return (
    <div className={cn("admin-root", undefined)} data-theme={theme} style={values as CSSProperties}>
      {/* The loader binds the hotkey, so it works before this chunk has loaded. */}
      <CommandPalette {...props} hotkey={false} />
    </div>
  );
}

export function mount(options: StandaloneOptions): void {
  const { documentCss, shadowCss } = splitCss();
  if (documentCss) {
    const style = document.createElement("style");
    style.dataset.adminPalette = "";
    style.textContent = documentCss;
    document.head.append(style);
  }

  const host = document.createElement("admin-palette");
  document.body.append(host);
  const shadow = host.attachShadow({ mode: "open" });
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(shadowCss);
  shadow.adoptedStyleSheets = [sheet];
  for (const href of options.stylesheets ?? []) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    shadow.append(link);
  }
  const container = document.createElement("div");
  shadow.append(container);
  createRoot(container).render(<App options={options} tokens={semanticTokens(shadowCss)} />);
}
