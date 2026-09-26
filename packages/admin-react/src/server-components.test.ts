import { describe, expect, it } from "vitest";

// Static guards for the React Server Components boundary; a Next.js build is
// the real test, but none runs in CI. Rules, per source module:
// - a hook or createContext needs "use client", unless only "use client"
//   modules import the module (then no server import can reach it);
// - so does a function prop the module creates, an event handler or a Base UI
//   render function: React can't send a function from the server;
// - a "use client" module assembles no compound: a server import sees an opaque
//   reference, so `Select.Popup` would be undefined;
// - a "use client" module renders no IconProp: a component reference can't cross
//   into a client component, so icons render in the directive-free module.

const sources = import.meta.glob<string>(
  ["./*.{ts,tsx}", "!./*.test.{ts,tsx}", "!./test-setup.ts"],
  { query: "?raw", import: "default", eager: true },
);

const modules = Object.entries(sources).map(([path, source]) => {
  const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
  return {
    file: path.slice(2),
    code,
    client: source.startsWith('"use client";'),
    // Value imports and re-exports; `import type` is erased and crosses no boundary.
    imports: [...code.matchAll(/^(?:import|export) (?!type\b)[^;]*? from "\.\/([^"]+)";/gms)].map(
      ([, name]) => name,
    ),
  };
});

const stem = (file: string) => file.replace(/\.tsx?$/, "");

function definesFunctionProp(code: string): boolean {
  if (/\b(on[A-Z]\w*|render)=\{\s*(\([^)]*\)|\w+)\s*=>/.test(code)) return true;
  // A handler declared in the module; `onClick={onDismiss}` passes the consumer's own prop.
  return [...code.matchAll(/\bon[A-Z]\w*=\{(\w+)\}/g)].some(([, name]) =>
    new RegExp(`\\b(function ${name}\\(|const ${name} = (async )?\\()`).test(code),
  );
}

// Its handlers wrap the consumer's `onPageChange`, which only a Client Component parent can
// pass; a server parent renders links through `renderItem` instead.
const WRAPS_CONSUMER_HANDLERS = new Set(["Pagination.tsx"]);

const serverModules = modules.filter((m) => !m.client);
const clientModules = modules.filter((m) => m.client);

describe("server components", () => {
  it.each(serverModules)("$file has no hook or createContext a server import can reach", (m) => {
    if (!/\b(use[A-Z]\w*|createContext)\s*[<(]/.test(m.code)) return;
    const serverImporters = serverModules.filter((s) => s.imports.includes(stem(m.file)));
    expect(serverImporters.map((s) => s.file)).toEqual([]);
  });

  it.each(serverModules.filter((m) => !WRAPS_CONSUMER_HANDLERS.has(m.file)))(
    "$file creates no function prop",
    ({ code }) => {
      expect(definesFunctionProp(code)).toBe(false);
    },
  );

  it.each(clientModules)("$file assembles no compound and renders no icon prop", ({ code }) => {
    expect(code).not.toMatch(/Object\.assign\(/);
    expect(code).not.toMatch(/\brenderIcon\b/);
  });
});
