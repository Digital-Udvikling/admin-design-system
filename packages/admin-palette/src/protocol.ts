// The wire format between a registry or search server and the palette, published as JSON Schema
// (`registry.schema.json`, `search.schema.json`). Within a protocol version, changes are additive:
// a palette ignores fields it doesn't know and skips commands it can't run.

/** The major version this palette reads; a document with another one is treated as unavailable. */
export const PROTOCOL = 1;

/** A command another system offers. It only navigates: JSON carries no functions. */
export interface RemoteCommand {
  /** Unique within its system; the palette prefixes it with the system id (`oms.orders`). */
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
  /** Tabler icon name, e.g. `"package"`. */
  icon?: string;
  /** Relative to the system's `url` in a registry, to the endpoint's URL in a search response. */
  href?: string;
  /**
   * Regular expression (JavaScript syntax, no flags) the query must match for the command to list;
   * `{q}` in `title` and `href` is replaced by the query.
   */
  pattern?: string;
  /** A nested page: a static list, or a search endpoint queried inside it. */
  children?: RemoteCommand[] | RemoteSearch;
}

/** A search endpoint: `GET <search>?q=<query>` answering a `SearchResponse`. */
export interface RemoteSearch {
  /** Relative to the system's `url`. */
  search: string;
  /** Audience passed to the palette's `token` function; the request then carries `Authorization: Bearer`. */
  resource?: string;
  minQuery?: number;
  /** Milliseconds. */
  debounce?: number;
  /** Milliseconds. */
  timeout?: number;
}

/** A search endpoint queried from the root. */
export interface RemoteSource extends RemoteSearch {
  /** Unique within its system. */
  id: string;
  /** Default: the system's name. */
  group?: string;
  /** Regular expression (JavaScript syntax, no flags) the query must match to search. */
  pattern?: string;
  priority?: number;
}

export interface RegistrySystem {
  id: string;
  name: string;
  /** Absolute base URL; command hrefs and search endpoints resolve against it. */
  url: string;
  icon?: string;
  commands?: RemoteCommand[];
  sources?: RemoteSource[];
}

/** The document a `registry` URL serves. */
export interface PaletteRegistry {
  $schema?: string;
  protocol: typeof PROTOCOL;
  systems: RegistrySystem[];
}

/** What a search endpoint answers. */
export interface SearchResponse {
  $schema?: string;
  protocol: typeof PROTOCOL;
  items: RemoteCommand[];
}
