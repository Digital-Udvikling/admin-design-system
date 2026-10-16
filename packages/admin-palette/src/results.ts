import {
  Layer,
  isStaticList,
  matchCommands,
  orderGroups,
  walkCommands,
  type CommandSet,
  type ResultGroup,
  type ResultItem,
  type ScoredGroup,
} from "./rank";
import type { Located } from "./recents";
import type { Command, Source } from "./types";

export interface SourceState {
  status: "pending" | "done" | "error";
  /** While pending, the previous query's results, so the list doesn't blank between keystrokes. */
  items: readonly Command[];
}

export interface ResultsInput {
  sets: readonly CommandSet[];
  /** The sources searched for `query`: the root's, or the open page's. */
  sources: readonly Source[];
  sourceStates: ReadonlyMap<string, SourceState>;
  query: string;
  /** The nested page open, if any. */
  page: Command | undefined;
  recents: readonly Located[];
  /** Command ids listed under Suggested on the empty root. */
  suggested: readonly string[];
}

/** Finds a command by id among the sets, nested pages included. */
export function locate(sets: readonly CommandSet[], id: string): Located | undefined {
  for (const { commands } of sets) {
    for (const { command, path } of walkCommands(commands)) {
      if (command.id === id) return { command, path: path.map((c) => c.title) };
    }
  }
  return undefined;
}

const item = (groupKey: string, { command, path }: Located): ResultItem => ({
  key: `${groupKey}\0${command.id}`,
  command,
  path,
});

function sourceGroups(input: ResultsInput, inPage: boolean): ScoredGroup[] {
  const out: ScoredGroup[] = [];
  for (const source of input.sources) {
    const state = input.sourceStates.get(source.id);
    if (!state) continue;
    const key = `source\0${source.id}`;
    const items = state.items.map((command) => item(key, { command, path: [] }));
    if (state.status === "done" && items.length === 0) continue;
    out.push({
      key,
      label: source.group ?? (inPage ? undefined : "Results"),
      items,
      status: state.status === "done" ? undefined : state.status,
      score: source.priority ?? 0,
      layer: Layer.source,
    });
  }
  return out;
}

/** Commands in their given order, grouped by `group` at each group's first appearance. */
function inOrder(commands: readonly Command[]): ResultGroup[] {
  const groups = new Map<string, ResultGroup>();
  for (const command of commands) {
    const key = command.group ?? "";
    let group = groups.get(key);
    if (!group) {
      group = { key, label: command.group, items: [] };
      groups.set(key, group);
    }
    group.items.push(item(key, { command, path: [] }));
  }
  return [...groups.values()];
}

/** Recent, then Suggested, then This page; a command shows once, in the first. */
function emptyRoot(input: ResultsInput): ResultGroup[] {
  const seen = new Set<string>();
  const group = (key: string, label: string, entries: readonly Located[]): ResultGroup => ({
    key,
    label,
    items: entries
      .filter(({ command }) => {
        if (seen.has(command.id)) return false;
        seen.add(command.id);
        return true;
      })
      .map((entry) => item(key, entry)),
  });
  const page = input.sets.find((set) => set.layer === Layer.page)?.commands ?? [];
  const suggested = input.suggested.flatMap((id) => locate(input.sets, id) ?? []);
  return [
    group("recent", "Recent", input.recents),
    group("suggested", "Suggested", suggested),
    group(
      "page",
      "This page",
      page.map((command) => ({ command, path: [] })),
    ),
  ].filter((g) => g.items.length > 0);
}

/** The groups the palette lists, in display order. */
export function buildResults(input: ResultsInput): ResultGroup[] {
  const { page, query } = input;
  if (page) {
    if (!isStaticList(page.children)) return orderGroups(sourceGroups(input, true));
    if (!query) return inOrder(page.children);
    return orderGroups(matchCommands([{ layer: Layer.system, commands: page.children }], query));
  }
  if (!query) return emptyRoot(input);
  return orderGroups([...matchCommands(input.sets, query), ...sourceGroups(input, false)]);
}

/** Whether `source` searches `query`. */
export function searches(source: Source, query: string, inPage: boolean): boolean {
  const minQuery = source.minQuery ?? (inPage ? 0 : 1);
  // `search`, unlike `test`, ignores a global pattern's `lastIndex`.
  return (
    query.length >= minQuery && (source.pattern === undefined || query.search(source.pattern) >= 0)
  );
}
