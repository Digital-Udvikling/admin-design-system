/**
 * Sätteri hast plugin: marks a body row whose first cell has the same text as the row above
 * `data-repeat`, so a Reference table can show each part's name once per run of rows
 * (global.css). The cell keeps its text for screen readers and copy.
 *
 * @returns {import("@astrojs/markdown-satteri").HastPluginDefinition}
 */
export default function groupTableRows() {
  return {
    name: "group-table-rows",
    element: {
      filter: ["tbody"],
      visit(tbody, ctx) {
        let previous;
        for (const row of tbody.children) {
          if (row.type !== "element" || row.tagName !== "tr") continue;
          const first = row.children.find((c) => c.type === "element");
          const name = first ? ctx.textContent(first).trim() : undefined;
          if (name && name === previous) ctx.setProperty(row, "dataRepeat", "");
          previous = name;
        }
      },
    },
  };
}
