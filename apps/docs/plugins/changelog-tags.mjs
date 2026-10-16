const TAG = /(\S*)\s+\((css|react|both)\)\s*$/;

/**
 * Sätteri hast plugin, CHANGELOG.md only: turns a bullet's trailing `(css)` / `(react)` /
 * `(both)` package tag into a `.badge`, kept on one line with the word before it by a
 * `.changelog-tag` nowrap span (global.css). CHANGELOG.md, the npm tarball copy and the
 * GitHub Release text keep the plain tag.
 *
 * @param {{ fileURL: URL | undefined }} ctx
 * @returns {import("@astrojs/markdown-satteri").HastPluginDefinition | null}
 */
export default function changelogTags(ctx) {
  if (!ctx.fileURL?.pathname.endsWith("/CHANGELOG.md")) return null;
  return {
    name: "changelog-tags",
    element: {
      filter: ["li"],
      visit(li, ctx) {
        const last = li.children.at(-1);
        const match = last?.type === "text" ? TAG.exec(last.value) : null;
        if (!last || !match) return;
        const [, word, pkg] = match;
        const tag = {
          type: "element",
          tagName: "span",
          properties: { className: ["changelog-tag"] },
          children: [
            { type: "text", value: `${word} ` },
            {
              type: "element",
              tagName: "span",
              properties: { className: ["badge"] },
              children: [{ type: "text", value: pkg }],
            },
          ],
        };
        ctx.setProperty(li, "children", [
          ...li.children.slice(0, -1),
          { type: "text", value: last.value.slice(0, match.index) },
          tag,
        ]);
      },
    },
  };
}
