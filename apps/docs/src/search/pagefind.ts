// Site search over the Pagefind index that the docs `build` script writes to dist/pagefind,
// as a command palette source: one group per page, its best sections as rows.
import type { Command, Source } from "@aortl/admin-palette";

interface Anchor {
  element: string;
  text: string;
  location: number;
}
interface SubResult {
  title: string;
  url: string;
  excerpt: string;
  anchor?: Anchor;
  weighted_locations: { balanced_score: number }[];
}
interface ResultData {
  url: string;
  meta: { title?: string };
  anchors: Anchor[];
  sub_results: SubResult[];
}
interface Pagefind {
  options(options: { baseUrl?: string; excerptLength?: number }): Promise<void>;
  search(query: string): Promise<{ results: { data(): Promise<ResultData> }[] }>;
}

const MAX_PAGES = 8;
// Pages loaded before reranking, so a page named by the query surfaces from further down.
const CANDIDATES = 16;
const MAX_ROWS_PER_PAGE = 3;

// Pagefind weights a hit in a heading above one in body text, so a matching section title ranks first.
const score = (sub: SubResult) =>
  sub.weighted_locations.reduce((sum, l) => sum + l.balanced_score, 0);
const plain = (text: string) => text.toLowerCase().replaceAll("-", "");
// Pagefind escapes the indexed text and wraps the matches in <mark>.
const toText = (html: string) =>
  new DOMParser().parseFromString(html, "text/html").body.textContent ?? "";
const hasFragment = (sub: SubResult, fragment: string) =>
  plain(toText(sub.excerpt)).includes(fragment);

function topSections(subs: SubResult[], query: string) {
  const ranked = subs
    .map((sub) => ({ sub, score: score(sub) }))
    .sort((a, b) => b.score - a.score)
    .map(({ sub }) => sub);
  if (!query.includes("-")) return ranked.slice(0, MAX_ROWS_PER_PAGE);
  // Keep the best row (often a heading hit), then rows holding the fragment ahead of rows that
  // match only a split part (`col` in "columns").
  const fragment = plain(query);
  const [best, ...rest] = ranked;
  return [
    ...(best ? [best] : []),
    ...rest.filter((sub) => hasFragment(sub, fragment)),
    ...rest.filter((sub) => !hasFragment(sub, fragment)),
  ].slice(0, MAX_ROWS_PER_PAGE);
}

// Pagefind favours short pages and prefix matches, so `button` ranks Copy button over Buttons and
// `tab` ranks Tables over Tabs. A page whose title is the query, singular or plural, goes first.
const words = (text: string) => text.toLowerCase().split(/\s+/).filter(Boolean).join(" ");
function namesQuery(page: ResultData, query: string) {
  const title = words(page.meta.title ?? "");
  const q = words(query);
  return [q, `${q}s`, `${q}es`].includes(title) || [title, `${title}s`, `${title}es`].includes(q);
}

const level = (anchor: Anchor) => Number(anchor.element.slice(1)) || 0;
// A repeated heading (the changelog's Added/Fixed under each version) needs its parent heading.
function parentHeading(page: ResultData, sub: SubResult) {
  const anchor = sub.anchor;
  if (!anchor || page.anchors.filter((a) => a.text === anchor.text).length < 2) return undefined;
  return page.anchors.findLast(
    (a) => a.location < anchor.location && level(a) > 0 && level(a) < level(anchor),
  )?.text;
}

function row(page: ResultData, sub: SubResult): Command {
  const pageTitle = page.meta.title ?? "";
  const isPage = sub.url === page.url || sub.title === pageTitle;
  const parent = isPage ? undefined : parentHeading(page, sub);
  return {
    id: `search:${sub.url}`,
    title: isPage ? pageTitle : parent ? `${parent} › ${sub.title}` : sub.title,
    description: toText(sub.excerpt),
    group: pageTitle,
    href: sub.url,
  };
}

/** Searches the built site; fails (shown as unavailable) under `astro dev`, which has no index. */
export function pagefindSource(base: string): Source {
  let pagefind: Promise<Pagefind> | undefined;
  const load = () => {
    pagefind ??= import(/* @vite-ignore */ `${base}pagefind/pagefind.js`).then(
      async (pf: Pagefind) => {
        await pf.options({ baseUrl: base, excerptLength: 18 });
        return pf;
      },
    );
    return pagefind;
  };
  return {
    id: "pagefind",
    group: "Docs",
    // Below an exact or prefix page-title match, above weaker ones.
    priority: 4,
    async search(query) {
      const pf = await load();
      // Pagefind indexes `table-pin-col` as `tablepincol` plus its parts, so the parts let
      // `pin-col` match it, and the joined term narrows the pages; topSections picks the rows.
      const terms = query.includes("-") ? `${query} ${query.replaceAll("-", " ")}` : query;
      const found = await pf.search(terms);
      const candidates = await Promise.all(found.results.slice(0, CANDIDATES).map((r) => r.data()));
      const pages = [
        ...candidates.filter((p) => namesQuery(p, query)),
        ...candidates.filter((p) => !namesQuery(p, query)),
      ].slice(0, MAX_PAGES);
      return pages.flatMap((p) => topSections(p.sub_results, query).map((s) => row(p, s)));
    },
  };
}
