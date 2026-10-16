import {
  PROTOCOL,
  type PaletteRegistry,
  type RemoteCommand,
  type RemoteSearch,
  type SearchResponse,
} from "./protocol";
import type { Command, Source } from "./types";

/** Bearer tokens for remote endpoints, per `resource`; `refresh` skips the cached one after a 401. */
export type TokenGetter = (resource: string, refresh?: boolean) => Promise<string | undefined>;

export interface RemoteCommands {
  commands: Command[];
  sources: Source[];
}

/** Whether a registry or search response speaks this palette's protocol version. */
export function speaksProtocol(doc: unknown): boolean {
  const protocol = (doc as { protocol?: unknown } | null)?.protocol;
  return typeof protocol === "number" && Math.floor(protocol) === PROTOCOL;
}

function regex(source: string | undefined): RegExp | undefined | null {
  if (source === undefined) return undefined;
  try {
    return new RegExp(source);
  } catch {
    return null;
  }
}

// URL parsing percent-encodes the `{q}` placeholder; keep it literal for `fillPattern`.
const PLACEHOLDER = /%7Bq%7D/gi;

/** A same-origin link as a path, so `onNavigate` can route it; another origin's as a full URL. */
function resolveHref(href: string, base: string): string {
  const url = new URL(href, base);
  const out =
    url.origin === window.location.origin ? url.pathname + url.search + url.hash : url.href;
  return out.replace(PLACEHOLDER, "{q}");
}

/**
 * A remote command as a palette command, its id prefixed with `namespace`; undefined when the
 * palette can't run it (malformed, a kind it doesn't know, or nothing to open).
 */
function toCommand(
  remote: RemoteCommand,
  namespace: string,
  base: string,
  token: TokenGetter,
): Command | undefined {
  if (typeof remote?.id !== "string" || typeof remote.title !== "string") return undefined;
  if ("kind" in remote) return undefined;
  const pattern = regex(remote.pattern);
  if (pattern === null) return undefined;
  const id = `${namespace}.${remote.id}`;
  let children: Command["children"];
  if (Array.isArray(remote.children)) {
    children = remote.children.flatMap((c) => toCommand(c, id, base, token) ?? []);
  } else if (typeof remote.children?.search === "string") {
    children = remoteSource(remote.children, { id }, base, token);
  }
  if (remote.href === undefined && children === undefined) return undefined;
  return {
    id,
    title: remote.title,
    description: remote.description,
    keywords: remote.keywords,
    icon: remote.icon,
    href: remote.href === undefined ? undefined : resolveHref(remote.href, base),
    pattern,
    children,
  };
}

/** A `Source` that queries a remote search endpoint. */
function remoteSource(
  search: RemoteSearch,
  source: Pick<Source, "id" | "group" | "priority" | "pattern">,
  base: string,
  token: TokenGetter,
): Source {
  return {
    ...source,
    minQuery: search.minQuery,
    debounce: search.debounce,
    timeout: search.timeout,
    async search(query, { signal }) {
      const url = new URL(search.search, base);
      url.searchParams.set("q", query);
      const request = async (refresh: boolean) => {
        const bearer = search.resource ? await token(search.resource, refresh) : undefined;
        return fetch(url, {
          signal,
          headers: bearer ? { Authorization: `Bearer ${bearer}` } : undefined,
        });
      };
      let response = await request(false);
      if (response.status === 401 && search.resource) response = await request(true);
      if (!response.ok) throw new Error(`${url.href} answered ${response.status}`);
      const body = (await response.json()) as SearchResponse;
      if (!speaksProtocol(body) || !Array.isArray(body.items)) {
        throw new Error(`${url.href} doesn't speak protocol ${PROTOCOL}`);
      }
      const itemBase = response.url || url.href;
      return body.items.flatMap((item) => toCommand(item, source.id, itemBase, token) ?? []);
    },
  };
}

/**
 * The commands and root sources of every system in `doc`, ids prefixed with the system id and
 * grouped under its name. `filter` drops commands, e.g. those of systems the user can't open.
 */
export function registryCommands(
  doc: PaletteRegistry,
  token: TokenGetter,
  filter?: (command: Command, system: string) => boolean,
): RemoteCommands {
  const commands: Command[] = [];
  const sources: Source[] = [];
  for (const system of Array.isArray(doc.systems) ? doc.systems : []) {
    if (typeof system?.id !== "string" || typeof system.url !== "string") continue;
    const name = typeof system.name === "string" ? system.name : system.id;
    for (const remote of Array.isArray(system.commands) ? system.commands : []) {
      const command = toCommand(remote, system.id, system.url, token);
      if (!command || (filter && !filter(command, system.id))) continue;
      commands.push({ ...command, group: name, icon: command.icon ?? system.icon });
    }
    for (const remote of Array.isArray(system.sources) ? system.sources : []) {
      const pattern = regex(remote?.pattern);
      if (typeof remote?.id !== "string" || typeof remote.search !== "string" || pattern === null) {
        continue;
      }
      sources.push(
        remoteSource(
          remote,
          {
            id: `${system.id}.${remote.id}`,
            group: remote.group ?? name,
            priority: remote.priority,
            pattern,
          },
          system.url,
          token,
        ),
      );
    }
  }
  return { commands, sources };
}
