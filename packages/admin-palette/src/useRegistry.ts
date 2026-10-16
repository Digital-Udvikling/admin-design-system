"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PaletteRegistry } from "./protocol";
import { speaksProtocol, type TokenGetter } from "./registry";

/** A registry document, or where to fetch one. */
export type RegistryOption = PaletteRegistry | { url: string; resource?: string };

// Per tab: later pages render the cached copy at once and refresh it in the background.
const CACHE_PREFIX = "admin-palette:registry:";
const STALE_AFTER = 5 * 60_000;

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

export interface RegistryState {
  doc: PaletteRegistry | undefined;
  /** The fetch failed and there's no copy to show. */
  failed: boolean;
  /** Loads the registry unless a fresh copy is in hand; call on open and on signs of intent. */
  load: () => void;
  token: TokenGetter;
}

/**
 * The registry, set client-side only so server and hydration markup agree. A URL is fetched on
 * `load`, never on mount, with `token(resource)` when the option names a `resource`.
 */
export function useRegistry(
  registry: RegistryOption | undefined,
  token: ((resource: string) => Promise<string>) | undefined,
): RegistryState {
  const [doc, setDoc] = useState<PaletteRegistry | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  const tokenRef = useRef(token);
  tokenRef.current = token;
  const tokens = useRef(new Map<string, Promise<string>>());
  const fetchedAt = useRef(0);
  const inflight = useRef(false);

  const getToken = useCallback<TokenGetter>(async (resource, refresh) => {
    const fn = tokenRef.current;
    if (!fn) return undefined;
    if (refresh) tokens.current.delete(resource);
    let pending = tokens.current.get(resource);
    if (!pending) {
      pending = fn(resource);
      tokens.current.set(resource, pending);
      pending.catch(() => tokens.current.delete(resource));
    }
    return pending;
  }, []);

  const url = registry && "url" in registry ? registry.url : undefined;
  const resource = registry && "url" in registry ? registry.resource : undefined;
  const inline = registry && !("url" in registry) ? registry : undefined;
  // An inline document written as a literal is a new object each render.
  const inlineRef = useRef(inline);
  inlineRef.current = inline;
  const inlineKey = inline ? JSON.stringify(inline) : undefined;

  useEffect(() => {
    const current = inlineRef.current;
    setDoc(current && speaksProtocol(current) ? current : undefined);
    setFailed(current !== undefined && !speaksProtocol(current));
    fetchedAt.current = 0;
  }, [inlineKey, url]);

  const load = useCallback(() => {
    if (url === undefined || inflight.current) return;
    if (Date.now() - fetchedAt.current < STALE_AFTER) return;
    const cached = readCache(url);
    if (cached) {
      setDoc(cached.doc);
      fetchedAt.current = cached.fetchedAt;
      if (Date.now() - cached.fetchedAt < STALE_AFTER) return;
    }
    inflight.current = true;
    void (async () => {
      const request = async (refresh: boolean) => {
        const bearer = resource ? await getToken(resource, refresh) : undefined;
        return fetch(url, { headers: bearer ? { Authorization: `Bearer ${bearer}` } : undefined });
      };
      let response = await request(false);
      if (response.status === 401 && resource) response = await request(true);
      if (!response.ok) throw new Error(`${url} answered ${response.status}`);
      const body: unknown = await response.json();
      if (!speaksProtocol(body)) throw new Error(`${url} speaks another protocol`);
      writeCache(url, body as PaletteRegistry);
      fetchedAt.current = Date.now();
      setDoc(body as PaletteRegistry);
      setFailed(false);
    })()
      .catch(() => setFailed(!readCache(url)))
      .finally(() => {
        inflight.current = false;
      });
  }, [url, resource, getToken]);

  return useMemo(() => ({ doc, failed, load, token: getToken }), [doc, failed, load, getToken]);
}
