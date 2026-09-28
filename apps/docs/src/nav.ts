import type { CollectionEntry } from "astro:content";

type Entry = CollectionEntry<"docs">;

export interface NavLink {
  label: string;
  href: string;
}

/** A sub-directory group: its `index.mdx` page first, then the rest. */
export interface NavTree {
  label: string;
  links: NavLink[];
}

export interface NavGroup {
  /** Omitted for a group that is a single top-level link. */
  label?: string;
  items: (NavLink | NavTree)[];
}

/** Sidebar sections in display order; `dir` pages are listed from the collection. */
const SECTIONS: ({ label: string; dir: string } | NavLink)[] = [
  { label: "Getting started", dir: "getting-started" },
  { label: "Basics", dir: "basics" },
  { label: "Changelog", href: "changelog/" },
  { label: "Components", dir: "components" },
  { label: "Patterns", dir: "patterns" },
  { label: "Modules", dir: "modules" },
  { label: "Contributing", dir: "contributing" },
];

/** The site path of an entry, relative to the base: `components/buttons/`, `""` for the home page. */
export function entryPath(entry: Entry): string {
  return entry.id === "index" ? "" : `${entry.id}/`;
}

function byOrder(a: Entry, b: Entry): number {
  const oa = a.data.sidebar?.order ?? Infinity;
  const ob = b.data.sidebar?.order ?? Infinity;
  return oa === ob ? a.data.title.localeCompare(b.data.title) : oa - ob;
}

function link(entry: Entry, base: string): NavLink {
  return { label: entry.data.title, href: `${base}${entryPath(entry)}` };
}

/** Sidebar groups for every docs page. `base` is `import.meta.env.BASE_URL`. */
export function buildNav(entries: Entry[], base: string): NavGroup[] {
  return SECTIONS.map((section) => {
    if ("href" in section)
      return { items: [{ label: section.label, href: `${base}${section.href}` }] };
    // The glob loader ids an `index.mdx` by its directory: `components/forms`.
    const inDir = entries.filter((e) => e.id === section.dir || e.id.startsWith(`${section.dir}/`));
    const depth = (e: Entry) => e.id.split("/").length;
    const subdirs = new Map<string, Entry[]>();
    for (const e of inDir) {
      const sub = e.id.split("/")[1];
      if (sub && (depth(e) > 2 || inDir.some((o) => o.id.startsWith(`${e.id}/`))))
        subdirs.set(sub, [...(subdirs.get(sub) ?? []), e]);
    }
    const direct = inDir.filter((e) => !subdirs.has(e.id.split("/")[1] ?? "")).sort(byOrder);
    const items: { title: string; item: NavLink | NavTree }[] = direct.map((e) => ({
      title: e.data.title,
      item: link(e, base),
    }));
    for (const [sub, pages] of subdirs) {
      const index = pages.find((e) => depth(e) === 2);
      const rest = pages.filter((e) => e !== index).sort(byOrder);
      const label = index?.data.title ?? sub;
      items.push({
        title: label,
        // The trigger already carries the index page's title.
        item: {
          label,
          links: [
            ...(index ? [{ ...link(index, base), label: "Overview" }] : []),
            ...rest.map((e) => link(e, base)),
          ],
        },
      });
    }
    // Sub-directory trees sit among the pages alphabetically, as their labels would.
    const ordered = direct.some((e) => e.data.sidebar)
      ? items
      : items.sort((a, b) => a.title.localeCompare(b.title));
    return { label: section.label, items: ordered.map(({ item }) => item) };
  });
}
