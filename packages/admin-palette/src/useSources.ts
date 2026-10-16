import { useEffect, useRef, useState } from "react";
import { searches, type SourceState } from "./results";
import type { Source } from "./types";

const DEFAULT_DEBOUNCE = 150;
const DEFAULT_TIMEOUT = 3000;

const EMPTY: ReadonlyMap<string, SourceState> = new Map();

/**
 * Runs each source that searches `query`, debounced, aborting the previous query's searches.
 * A source missing from the result doesn't search this query.
 */
export function useSources(
  sources: readonly Source[],
  query: string,
  { enabled, inPage }: { enabled: boolean; inPage: boolean },
): ReadonlyMap<string, SourceState> {
  const [states, setStates] = useState(EMPTY);
  // A fresh array of the same sources on each render must not restart their searches.
  const sourcesRef = useRef(sources);
  sourcesRef.current = sources;
  const ids = sources.map((s) => s.id).join("\0");

  useEffect(() => {
    const eligible = enabled ? sourcesRef.current.filter((s) => searches(s, query, inPage)) : [];
    setStates((prev) =>
      eligible.length === 0
        ? EMPTY
        : new Map(
            eligible.map((s) => [s.id, { status: "pending", items: prev.get(s.id)?.items ?? [] }]),
          ),
    );
    if (eligible.length === 0) return;

    const controller = new AbortController();
    const timers: ReturnType<typeof setTimeout>[] = [];
    const settle = (id: string, state: SourceState) => {
      if (!controller.signal.aborted) setStates((prev) => new Map(prev).set(id, state));
    };
    for (const source of eligible) {
      timers.push(
        setTimeout(() => {
          const own = new AbortController();
          const abort = () => own.abort();
          controller.signal.addEventListener("abort", abort);
          const timeout = setTimeout(() => {
            own.abort();
            settle(source.id, { status: "error", items: [] });
          }, source.timeout ?? DEFAULT_TIMEOUT);
          source
            .search(query, { signal: own.signal })
            .then(
              (items) => !own.signal.aborted && settle(source.id, { status: "done", items }),
              () => !own.signal.aborted && settle(source.id, { status: "error", items: [] }),
            )
            .finally(() => {
              clearTimeout(timeout);
              controller.signal.removeEventListener("abort", abort);
            });
        }, source.debounce ?? DEFAULT_DEBOUNCE),
      );
    }
    return () => {
      controller.abort();
      for (const timer of timers) clearTimeout(timer);
    };
  }, [ids, query, enabled, inPage]);

  return states;
}
