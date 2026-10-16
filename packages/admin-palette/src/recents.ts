import type { Command } from "./types";

// Per origin, so recents carry across a system's pages but not between systems.
const STORAGE_KEY = "admin-palette:recent";
const MAX_RECENTS = 5;

/** A link is stored whole, so it comes back after its source is gone; an action only by id. */
interface RecentEntry {
  id: string;
  title?: string;
  href?: string;
  description?: string;
  icon?: string;
  path?: string[];
}

export interface Located {
  command: Command;
  path: readonly string[];
}

function read(): RecentEntry[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((e): e is RecentEntry => typeof e?.id === "string")
      : [];
  } catch {
    // Storage blocked (private mode, sandboxed frame) or a corrupt value.
    return [];
  }
}

export function recordRecent({ command, path }: Located): void {
  const entry: RecentEntry = command.href
    ? {
        id: command.id,
        title: command.title,
        href: command.href,
        description: command.description,
        icon: typeof command.icon === "string" ? command.icon : undefined,
        path: [...path],
      }
    : { id: command.id };
  try {
    const next = [entry, ...read().filter((e) => e.id !== entry.id)].slice(0, MAX_RECENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Recents are a convenience; a full or blocked storage just drops them.
  }
}

/**
 * The recent commands still worth showing, newest first: the live command with the same id, else
 * the stored link. An action no longer registered (another page's) is skipped.
 */
export function readRecents(find: (id: string) => Located | undefined): Located[] {
  const out: Located[] = [];
  for (const entry of read()) {
    const live = find(entry.id);
    if (live) out.push(live);
    else if (entry.href && entry.title) {
      const { path = [], ...command } = entry;
      out.push({ command: { ...command, title: entry.title }, path });
    }
  }
  return out;
}
