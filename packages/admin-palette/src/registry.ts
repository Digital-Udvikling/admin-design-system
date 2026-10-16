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

/** `href` resolved against `base` if it's an http(s) URL; a `javascript:` link would run in this app. */
function httpUrl(href: unknown, base: string): URL | undefined {
  if (typeof href !== "string") return undefined;
  try {
    const url = new URL(href, base);
    return url.protocol === "https:" || url.protocol === "http:" ? url : undefined;
  } catch {
    return undefined;
  }
}

/** A same-origin link as a path, so `onNavigate` can route it; another origin's as a full URL. */
function linkFor(url: URL): string {
  const out =
    url.origin === window.location.origin ? url.pathname + url.search + url.hash : url.href;
  return out.replace(PLACEHOLDER, "{q}");
}

const string = (value: unknown) => (typeof value === "string" ? value : undefined);
const number = (value: unknown) => (typeof value === "number" ? value : undefined);
const strings = (value: unknown) =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : undefined;

/**
 * A remote command as a palette command, its id prefixed with `namespace`; undefined when the
 * palette can't run it (malformed, a kind it doesn't know, or nothing to open). A wrongly typed
 * optional field is dropped.
 */
function toCommand(
  remote: RemoteCommand,
  namespace: string,
  base: string,
  token: TokenGetter,
): Command | undefined {
  if (typeof remote?.id !== "string" || typeof remote.title !== "string") return undefined;
  if ("kind" in remote) return undefined;
  const pattern = regex(string(remote.pattern));
  if (pattern === null) return undefined;
  const id = `${namespace}.${remote.id}`;
  let children: Command["children"];
  if (Array.isArray(remote.children)) {
    children = remote.children.flatMap((c) => toCommand(c, id, base, token) ?? []);
  } else if (remote.children && typeof remote.children === "object") {
    children = remoteSource(remote.children, { id }, base, token);
  }
  const url = remote.href === undefined ? undefined : httpUrl(remote.href, base);
  if (remote.href !== undefined && !url) return undefined;
  if (!url && !children) return undefined;
  return {
    id,
    title: remote.title,
    description: string(remote.description),
    keywords: strings(remote.keywords),
    icon: string(remote.icon),
    href: url && linkFor(url),
    pattern,
    children,
  };
}

/** A `Source` that queries a remote search endpoint, or undefined for an unusable one. */
function remoteSource(
  search: RemoteSearch,
  source: Pick<Source, "id" | "group" | "priority" | "pattern">,
  base: string,
  token: TokenGetter,
): Source | undefined {
  const endpoint = httpUrl(search.search, base);
  if (!endpoint) return undefined;
  const resource = string(search.resource);
  return {
    ...source,
    minQuery: number(search.minQuery),
    debounce: number(search.debounce),
    timeout: number(search.timeout),
    async search(query, { signal }) {
      const url = new URL(endpoint);
      url.searchParams.set("q", query);
      const request = async (refresh: boolean) => {
        const bearer = resource ? await token(resource, refresh) : undefined;
        return fetch(url, {
          signal,
          headers: bearer ? { Authorization: `Bearer ${bearer}` } : undefined,
        });
      };
      let response = await request(false);
      if (response.status === 401 && resource) response = await request(true);
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

/** Keeps a registry command or source; `system` is its system's id. */
export type RegistryFilter = (entry: Command | Source, system: string) => boolean;

/**
 * The commands and root sources of every system in `doc`, ids prefixed with the system id and
 * grouped under its name. `filter` drops entries, e.g. those of systems the user can't open.
 */
export function registryCommands(
  doc: PaletteRegistry,
  token: TokenGetter,
  filter?: RegistryFilter,
): RemoteCommands {
  const commands: Command[] = [];
  const sources: Source[] = [];
  for (const system of Array.isArray(doc.systems) ? doc.systems : []) {
    // Every href and endpoint resolves against `url`, so a relative or malformed one drops the system.
    if (typeof system?.id !== "string" || !httpUrl(system.url, "invalid:")) continue;
    const name = string(system.name) ?? system.id;
    const keep = (entry: Command | Source) => !filter || filter(entry, system.id);
    for (const remote of Array.isArray(system.commands) ? system.commands : []) {
      const command = toCommand(remote, system.id, system.url, token);
      if (!command) continue;
      const grouped = { ...command, group: name, icon: command.icon ?? string(system.icon) };
      if (keep(grouped)) commands.push(grouped);
    }
    for (const remote of Array.isArray(system.sources) ? system.sources : []) {
      const pattern = regex(string(remote?.pattern));
      if (typeof remote?.id !== "string" || pattern === null) continue;
      const source = remoteSource(
        remote,
        {
          id: `${system.id}.${remote.id}`,
          group: string(remote.group) ?? name,
          priority: number(remote.priority),
          pattern,
        },
        system.url,
        token,
      );
      if (source && keep(source)) sources.push(source);
    }
  }
  return { commands, sources };
}
