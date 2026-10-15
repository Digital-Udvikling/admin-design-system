/**
 * Sätteri mdast plugin: trims trailing whitespace off the text before a heading's trailing inline
 * JSX element (`### Hotkey <ReactOnly />`). The heading-id slugger reads the text content, so that
 * space otherwise becomes a trailing hyphen in the id (`hotkey-`). An element mid-heading keeps
 * the spaces around it.
 *
 * @returns {import("@astrojs/markdown-satteri").MdastPluginDefinition}
 */
export default function trimHeadingText() {
  return {
    name: "trim-heading-text",
    heading(node, ctx) {
      const last = node.children.at(-1);
      const prev = node.children.at(-2);
      if (last?.type !== "mdxJsxTextElement" || prev?.type !== "text") return;
      ctx.setProperty(prev, "value", prev.value.trimEnd());
    },
  };
}
