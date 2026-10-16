import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { PaletteRegistry } from "./protocol";
import { speaksProtocol, type TokenGetter } from "./registry";

/** A registry document, or where to fetch one. */
export type RegistryOption = PaletteRegistry | { url: string; resource?: string };

// Per tab: later pages render the cached copy at once and refresh it in the background.
const CACHE_PREFIX = "admin-palette:registry:";
const STALE_AFTER = 5 * 60_000;
// After a failure, intent (every Ctrl press) waits this long before trying again.
const RETRY_AFTER = 30_000;
const FETCH_TIMEOUT = 10_000;

interface Cached {
  fetchedAt: number;
  doc: PaletteRegistry;
}

function readCache(url: string): Cached | undefined {
  try {
    const cached = JSON.parse(
      sessionStorage.getItem(CACHE_PREFIX + url) ?? "null",
    ) as Cached | null;
    return cached && speaksProtocol(cached.doc) ? cached : undefined;
  } catch {
    return undefined;
  }
}

function writeCache(url: string, doc: PaletteRegistry) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + url, JSON.stringify({ fetchedAt: Date.now(), doc }));
  } catch {
    // A full or blocked storage only costs the next page a fetch.
  }
}

const subscribeNever = () => () => {};
const getHydrated = () => true;
const getServerHydrated = () => false;

export interface RegistryState {
  doc: PaletteRegistry | undefined;
  /** The registry is unusable: the fetch failed with no copy to show, or it speaks another protocol. */
  failed: boolean;
  /** Whether `load` fetches anything: the option is a URL. */
  fetches: boolean;
  /** Loads the registry unless a fresh copy is in hand; call on open and on signs of intent. */
  load: () => void;
  token: TokenGetter;
}

/**
 * The registry, on the client only so server and hydration markup agree. A URL is fetched on
 * `load`, never on mount, with `token(resource)` when the option names a `resource`.
 */
export function useRegistry(
  registry: RegistryOption | undefined,
  token: ((resource: string) => Promise<string>) | undefined,
): RegistryState {
  const hydrated = useSyncExternalStore(subscribeNever, getHydrated, getServerHydrated);
  const url = registry && "url" in registry ? registry.url : undefined;
  const resource = registry && "url" in registry ? registry.resource : undefined;
  const inline = registry && !("url" in registry) ? registry : undefined;

  // Keyed by URL, so a response for a previous URL never shows under the current one.
  const [fetched, setFetched] = useState<{ url: string; doc?: PaletteRegistry; failed: boolean }>();
  const urlRef = useRef(url);
  urlRef.current = url;
  const fetchedAt = useRef(new Map<string, number>());
  const failedAt = useRef(new Map<string, number>());
  const inflight = useRef(new Set<string>());

  const tokenRef = useRef(token);
  tokenRef.current = token;
  const tokens = useRef(new Map<string, Promise<string>>());
  useEffect(() => {
    tokens.current.clear();
  }, [token]);

  const getToken = useCallback<TokenGetter>(async (tokenResource, refresh) => {
    const fn = tokenRef.current;
    if (!fn) return undefined;
    if (refresh) tokens.current.delete(tokenResource);
    let pending = tokens.current.get(tokenResource);
    if (!pending) {
      pending = fn(tokenResource);
      tokens.current.set(tokenResource, pending);
      pending.catch(() => tokens.current.delete(tokenResource));
    }
    return pending;
  }, []);

  const load = useCallback(() => {
    if (url === undefined || inflight.current.has(url)) return;
    const now = Date.now();
    if (now - (fetchedAt.current.get(url) ?? 0) < STALE_AFTER) return;
    if (now - (failedAt.current.get(url) ?? 0) < RETRY_AFTER) return;
    const cached = readCache(url);
    if (cached) {
      setFetched({ url, doc: cached.doc, failed: false });
      fetchedAt.current.set(url, cached.fetchedAt);
      if (now - cached.fetchedAt < STALE_AFTER) return;
    }
    inflight.current.add(url);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    void (async () => {
      const request = async (refresh: boolean) => {
        const bearer = resource ? await getToken(resource, refresh) : undefined;
        return fetch(url, {
          signal: controller.signal,
          headers: bearer ? { Authorization: `Bearer ${bearer}` } : undefined,
        });
      };
      let response = await request(false);
      if (response.status === 401 && resource) response = await request(true);
      if (!response.ok) throw new Error(`${url} answered ${response.status}`);
      const body: unknown = await response.json();
      if (!speaksProtocol(body)) throw new Error(`${url} speaks another protocol`);
      writeCache(url, body as PaletteRegistry);
      fetchedAt.current.set(url, Date.now());
      if (urlRef.current === url) setFetched({ url, doc: body as PaletteRegistry, failed: false });
    })()
      .catch(() => {
        failedAt.current.set(url, Date.now());
        if (urlRef.current === url && !cached) setFetched({ url, failed: true });
      })
      .finally(() => {
        clearTimeout(timeout);
        inflight.current.delete(url);
      });
  }, [url, resource, getToken]);

  let doc: PaletteRegistry | undefined;
  let failed = false;
  if (inline) {
    doc = hydrated && speaksProtocol(inline) ? inline : undefined;
    failed = hydrated && !speaksProtocol(inline);
  } else if (fetched && fetched.url === url) {
    ({ doc, failed } = fetched);
  }

  return useMemo(
    () => ({ doc, failed, fetches: url !== undefined, load, token: getToken }),
    [doc, failed, url, load, getToken],
  );
}
