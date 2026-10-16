import { rankItem, rankings } from "@tanstack/match-sorter-utils";
import type { Command } from "./types";

/** Where commands come from; breaks ties between groups that match equally well. */
export const Layer = { page: 0, system: 1, source: 2, registry: 3 } as const;
export type Layer = (typeof Layer)[keyof typeof Layer];

export interface ResultItem {
  /** Unique within one result list; the pinned highlight follows it. */
  key: string;
  command: Command;
  /** Ancestor titles of a command matched inside a nested page from the root. */
  path: readonly string[];
}

export interface ResultGroup {
  key: string;
  label?: string;
  items: ResultItem[];
  /** A source still searching, or one that failed or timed out. */
  status?: "pending" | "error";
}

export interface ScoredGroup extends ResultGroup {
  score: number;
  layer: Layer;
}

export interface CommandSet {
  layer: Layer;
  commands: readonly Command[];
  /** Heading for commands without a `group`. */
  defaultGroup?: string;
}

// A keyword or description hit ranks just under the same tier on the title; a match inside a
// nested page under the same tier at the top level.
const KEYWORD_PENALTY = 0.25;
const DESCRIPTION_PENALTY = 0.5;
const DEEP_PENALTY = 0.5;
const DEEP_PER_PARENT = 3;
const PATTERN_SCORE = rankings.EQUAL;

/** `command` with `{q}` filled in, or undefined when its pattern doesn't match `query`. */
export function fillPattern(command: Command, query: string): Command | undefined {
  if (!command.pattern) return command;
  // `search`, unlike `test`, ignores a global pattern's `lastIndex`.
  if (!query || query.search(command.pattern) < 0) return undefined;
  return {
    ...command,
    // A function replacement, so `$&` in the query stays literal.
    title: command.title.replaceAll("{q}", () => query),
    href: command.href?.replaceAll("{q}", () => encodeURIComponent(query)),
  };
}

/** match-sorter tier of the best field (title, keywords, description), 0 when none match. */
export function scoreCommand(command: Command, query: string): number {
  const title = rankItem(command.title, query);
  let best: number = title.passed ? title.rank : 0;
  for (const keyword of command.keywords ?? []) {
    const hit = rankItem(keyword, query, { threshold: rankings.ACRONYM });
    if (hit.passed) best = Math.max(best, hit.rank - KEYWORD_PENALTY);
  }
  if (command.description) {
    const hit = rankItem(command.description, query, { threshold: rankings.CONTAINS });
    if (hit.passed) best = Math.max(best, hit.rank - DESCRIPTION_PENALTY);
  }
  return best;
}

export const isStaticList = (children: Command["children"]): children is readonly Command[] =>
  Array.isArray(children);

/** Every command in `commands` and, depth first, their static children with ancestor paths. */
export function* walkCommands(
  commands: readonly Command[],
  path: readonly Command[] = [],
): Generator<{ command: Command; path: readonly Command[] }> {
  for (const command of commands) {
    yield { command, path };
    if (isStaticList(command.children)) {
      yield* walkCommands(command.children, [...path, command]);
    }
  }
}

/**
 * Groups of the commands matching `query`, best match first within a group. Static children match
 * too, filed under their top-level ancestor's group, at most `DEEP_PER_PARENT` per ancestor.
 */
export function matchCommands(sets: readonly CommandSet[], query: string): ScoredGroup[] {
  const groups = new Map<string, ScoredGroup & { scores: number[] }>();
  for (const { layer, commands, defaultGroup } of sets) {
    for (const top of commands) {
      const label = top.group ?? defaultGroup;
      const direct: { item: ResultItem; score: number }[] = [];
      const deep: { item: ResultItem; score: number }[] = [];
      for (const walked of walkCommands([top])) {
        const { path } = walked;
        const command = fillPattern(walked.command, query);
        if (!command) continue;
        const raw = command.pattern ? PATTERN_SCORE : scoreCommand(command, query);
        if (raw === 0) continue;
        const key = `${label ?? ""}\0${[...path, command].map((c) => c.id).join("/")}`;
        const item = { key, command, path: path.map((c) => c.title) };
        if (path.length === 0) direct.push({ item, score: raw });
        else deep.push({ item, score: raw - DEEP_PENALTY });
      }
      deep.sort((a, b) => b.score - a.score);
      const hits = [...direct, ...deep.slice(0, DEEP_PER_PARENT)];
      if (hits.length === 0) continue;
      const groupKey = label ?? "";
      let group = groups.get(groupKey);
      if (!group) {
        group = { key: groupKey, label, items: [], scores: [], score: 0, layer };
        groups.set(groupKey, group);
      }
      for (const { item, score } of hits) {
        group.items.push(item);
        group.scores.push(score);
      }
      group.layer = Math.min(group.layer, layer) as Layer;
    }
  }
  return [...groups.values()].map(({ scores, items, ...group }) => {
    const order = items.map((item, i) => ({ item, score: scores[i] ?? 0 }));
    // Array sort is stable: equal scores keep registration order.
    order.sort((a, b) => b.score - a.score);
    return { ...group, items: order.map((o) => o.item), score: order[0]?.score ?? 0 };
  });
}

/** Best match first; ties go page, system, sources, registry, then the order given. */
export function orderGroups(groups: readonly ScoredGroup[]): ResultGroup[] {
  return groups
    .map((group, index) => ({ group, index }))
    .sort(
      (a, b) => b.group.score - a.group.score || a.group.layer - b.group.layer || a.index - b.index,
    )
    .map(({ group: { score: _score, layer: _layer, ...group } }) => group);
}
