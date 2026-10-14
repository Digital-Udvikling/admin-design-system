/**
 * Sätteri mdast plugin: marks whitespace-free inline code of at most 24 chars `code-nowrap`,
 * so a token (`aria-disabled`, `--z-popup`) never splits at its own hyphen. Longer tokens keep wrapping.
 *
 * @returns {import("@astrojs/markdown-satteri").MdastPluginDefinition}
 */
export default function inlineCodeNowrap() {
  return {
    name: "inline-code-nowrap",
    inlineCode(node, ctx) {
      if (node.value.length > 24 || /\s/.test(node.value)) return;
      ctx.setProperty(node, "data", {
        ...node.data,
        hProperties: { ...node.data?.hProperties, className: ["code-nowrap"] },
      });
    },
  };
}
