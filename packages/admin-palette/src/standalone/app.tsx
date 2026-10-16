import { cn } from "@aortl/admin-react/internal";
import scopedCss from "@aortl/admin-css/admin.scoped.min.css?raw";
import { useEffect, useState } from "react";
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

/** `"dark"`/`"light"` when the page forces one through `color-scheme`, else undefined. */
function pageTheme(): "light" | "dark" | undefined {
  const scheme = getComputedStyle(document.documentElement).colorScheme;
  return scheme === "dark" || scheme === "light" ? scheme : undefined;
}

/** Follows the page's forced color scheme, which can't cross into the shadow root. */
function usePageTheme() {
  const [theme, setTheme] = useState(pageTheme);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(pageTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });
    return () => observer.disconnect();
  }, []);
  return theme;
}

function App({ options }: { options: StandaloneOptions }) {
  const theme = usePageTheme();
  const { stylesheets: _stylesheets, ...props } = options;
  // AdminRoot's markup without its confirm host, which would bundle Field and Input.
  return (
    <div className={cn("admin-root", undefined)} data-theme={theme}>
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
  createRoot(container).render(<App options={options} />);
}
